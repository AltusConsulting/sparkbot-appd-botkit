# Cisco Spark Notification Bot for AppDynamics Using BotKit

Inspired by [BotKit samples for Cisco Spark](https://github.com/CiscoDevNet/botkit-ciscospark-samples) by Stève Sfartz <mailto:stsfartz@cisco.com>

## Instructions for deployment

Either if you deploy locally or to Heroku, you'll need to perform these two tasks first:

1. Create a Bot Account from the ['Spark for developers' bot creation page](https://developer.ciscospark.com/add-bot.html), and copy your bot's access token.

1. Create an AppDynamics account if you don't already have one and copy your AppD account name (TIP: for SaaS deployments, the account name is what comes before "saas.appdynamics.com" in the URL).

## Heroku deployment

Click below to quickly deploy the bot to Heroku. You will need the following information:
* Your Spark token
* Your AppDynamics account name
* Your public URL (for a Heroku deployment this would be `https://{app-name}.herokuapp.com`, where `{app-name}` is the name you chose for your Heroku app).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Local deployment

1. Choose your storage type. You have two options: local storage using [JSON File Store (JFS)](https://www.npmjs.com/package/jfs) or [Redis](https://redis.io/), a NO-SQL, in-memory data structure store. If you choose to use JFS, you don't have to install anything yourself. If you choose to use Redis you'll need to [download](https://redis.io/download) and install it on your local machine, with the default settings (port 6379).

1. [Optional] Cisco Spark uses a webhook to send incoming messages to your bot, but webhooks require a public IP address. If you don't have one, you can use [ngrok](https://ngrok.com) to create a tunnel to your machine. Launch ngrok to expose port 3000 of your local machine to the internet:

    ```shell
    ngrok http 3000
    ```

    Pick the HTTPS address that ngrok is now exposing. Note that ngrok exposes HTTP and HTTPS protocols, make sure to pick the HTTPS address.

1. [Optional] Open the `.env` file and modify the settings to accomodate your bot.

    _Note that you can also specify any of these settings via env variables. In practice, the values on the command line or in your machine env will prevail over .env file settings. In the example below, we do not modify any value in settings and specify all configuration values on the command line._

1. You're ready to run your bot

From a bash shell, type:

```shell
> git clone https://github.com/AltusConsulting/sparkbot-appd-botkit.git
> cd sparkbot-appd-botkit
> npm install
> SPARK_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" APPD_ACCOUNT=myappdaccount1234567890 node bot.js
```

If you're using Redis, this last command would be:

```shell
> SPARK_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" APPD_ACCOUNT=myappdaccount1234567890 REDIS_URL=redis://localhost:6379/1 node bot.js
```

From a windows shell, type:

```shell
> git clone https://github.com/AltusConsulting/sparkbot-appd-botkit.git
> cd sparkbot-appd-botkit
> npm install
> set SPARK_TOKEN=0123456789abcdef
> set PUBLIC_URL=https://abcdef.ngrok.io
> set SECRET=not that secret
> set APPD_ACCOUNT=myappdaccount1234567890
> node bot.js
```

If you're using Redis, you'll need to add an additional environment variable before launching the bot:

```shell
> set REDIS_URL=redis://localhost:6379/1
```

where:

- SPARK_TOKEN is the API access token of your Cisco Spark bot.
- PUBLIC_URL is the root URL at which Cisco Spark can reach your bot. If you're using ngrok, this should be the URL ngrok exposes when you run it. 
- SECRET is the secret that Cisco Spark uses to sign the JSON webhooks events posted to your bot.
- APPD_ACCOUNT is your AppDynamics account name.
- REDIS_URL is the URL of the Redis instance you installed.


## Notifications Module

The notifications module allows you to subscribe to specific types of notifications (Errors, Warnings and Informational), so that when your AppDynamics instance detects an event in one of your monitored applications the AppD Bot will send you a message directly via Cisco Spark.

### Subscribing to a notification

You can subscribe to a notification by telling the AppD Bot:

```
subscribe
```
or, for short:
```
sub
```
The bot will then ask you what type of notification you want to subscribe to. You can subscribe to __INFO__, __WARN__ or __ERROR__ notifications.

### Unsubscribing from a notification

You can subscribe to a notification by telling the AppD Bot:

```
unsubscribe
```
or, for short:
```
unsub
```

The bot will then ask you what type of notification you want to unsubscribe from. 

### Showing your current subscriptions

You can ask the bot for a list of your current subscriptions:

```
show subscriptions
```
or, for short:
```
show sub
```

## Configuring your AppD server 

In order for notifications to be sent to your bot, you need to configure your AppD server accordingly. Here are the steps:

### 1. Create an __HTTP Request Template__.

* Navigate to _Alert & Respond_ -> _HTTP Request Templates_.
* Select _New_ to create a new template.
- Fill the information as follows:
    - **Name**: Something like "Sparkbot" or "Cisco Spark"
    - **Method**: POST
    - **Raw URL**: http://<PUBLIC_URL>/appd where PUBLIC_URL is the Internet facing URL where the bot can be reached, as defined in your environment variables
    - **URL Encoding**: UTF-8
    - **Authentication**: NONE
    - **MIME Type**: application/json
    - **Payload encoding**: UTF-8
    - **Payload**:
    ```
    [
    #foreach(${event} in ${fullEventList})
        #set( $msg = $event.summaryMessage.replace("
    ", "\\n") )
        {"app": "${event.application.name}",
        "appid": "${event.application.id}",
        "tier": "${event.tier.name}",
        "node": "${event.node.name}",
        "time": "${event.eventTime}",
        "deeplink": "${event.deepLink}",
        "name": "${event.displayName}",
        "severity": "${event.severity}",
        "message": "${msg}"}
        #if($velocityCount != $fullEventList.size()) , #end
    #end
    ]
    ```

### 2. Create an __Action__.

* Navigate to _Alert & Respond_ -> _Actions_.
* Select _Create_ to create a new action.
* Select _HTTP Request_ -> _Make an HTTP Request_ and the press OK.
* Assign a name to the request. It can be something like "Cisco Spark Bot"
* From the _HTTP Request Template_ dropdown list select the template created in the previous step.

### 3. Create a __Policy__.

* Navigate to _Alert & Respond_ -> _Policies_.
* Select _Create_ to create a new policy.
* Assign a name to your policy.
* Select the _Health Rule Violation Events_ and/or _Other Events_ you want to be notified about, depending on your needs.
* Press _Next_
* In _Actions to Execute_ press the plus (+) sign and then select the action you created in the previous step. Press _Select_.

Now you should begin receiving notifications from the AppD Bot on Cisco Spark, once you subscribe to them.
