# Webex Teams Notification Bot for AppDynamics Using BotKit (Demo version)

Inspired by [BotKit samples for Webex Teams](https://github.com/CiscoDevNet/botkit-webex-samples) by Stève Sfartz <mailto:stsfartz@cisco.com>

**Note**: This is a demo version of the bot. It's a stand alone version that doesn't require an AppDynamics account because it uses fake data. You can even generate fake events from the web interface at `PUBLIC_URL`.

## Instructions for deployment

Either if you deploy locally or to Heroku, you'll need to first create a Bot Account in the ['Webex for developers' bot creation page](https://developer.webex.com/add-bot.html), and copy your bot's access token.

## Heroku deployment

Click below to quickly deploy the bot to Heroku. You will need the following information:
* Your Bot token
* Your public URL (for a Heroku deployment this would be `https://{app-name}.herokuapp.com`, where `{app-name}` is the name you chose for your Heroku app).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Local deployment

1. Choose your storage type. You have two options: local storage using [JSON File Store (JFS)](https://www.npmjs.com/package/jfs) or [Redis](https://redis.io/), a NO-SQL, in-memory data structure store. If you choose to use JFS, you don't have to install anything yourself. If you choose to use Redis you'll need to [download](https://redis.io/download) and install it on your local machine, with the default settings (port 6379).

1. [Optional] Webex Teams uses a webhook to send incoming messages to your bot, but webhooks require a public IP address. If you don't have one, you can use [ngrok](https://ngrok.com) to create a tunnel to your machine. Launch ngrok to expose port 3000 of your local machine to the internet:

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
> BOT_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" node bot.js
```

If you're using Redis, this last command would be:

```shell
> BOT_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" REDIS_URL=redis://localhost:6379/1 node bot.js
```

From a windows shell, type:

```shell
> git clone https://github.com/AltusConsulting/sparkbot-appd-botkit.git
> cd sparkbot-appd-botkit
> npm install
> set BOT_TOKEN=0123456789abcdef
> set PUBLIC_URL=https://abcdef.ngrok.io
> set SECRET=not that secret
> node bot.js
```

If you're using Redis, you'll need to add an additional environment variable before launching the bot:

```shell
> set REDIS_URL=redis://localhost:6379/1
```

where:

- BOT_TOKEN is the API access token of your Webex Teams bot.
- PUBLIC_URL is the root URL at which Webex Teams can reach your bot. If you're using ngrok, this should be the URL ngrok exposes when you run it. 
- SECRET is the secret that Webex Teams uses to sign the JSON webhooks events posted to your bot.
- REDIS_URL is the URL of the Redis instance you installed.


### Testing your bot

To test that your bot is online, add it to your Webex Teams account as you will add any other contact and ask the bot for help with the `help` command.


## Notifications Module

The notifications module allows you to subscribe to specific types of notifications (Errors, Warnings and Informational), so that when your AppDynamics instance detects an event in one of your monitored applications the AppD Bot will send you a message directly via Webex Teams.

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

## Interactive Mode

You can interactively query your AppDynamics instance to get information about applications, events and application metrics.

### Show configured applications

You can show the existing configured applications with the following command:

```
show applications
```
or, for short:
```
show apps
```
The bot will then show a list of the existing applications.

### Show recent events

You can request the recent events for a specific application with the following command:

```
show events
```
or, for short:
```
show ev
```

The bot will then ask for the application for which you want to retrieve the events. Once you answer with one of the available applications the bot will then show a list of the most recent events for that specific application. For the time being this command retrieves events for the last week only. In the future this will be configurable.


### Show metrics for an application

You can request the metrics for a specific application with the following command:

```
show metrics for <app name>
```
for example, if there's an application called **MyNodeApp**, the command should be:
```
show metrics for MyNodeApp
```

The bot will then answer with all the **Overall Application Performance** metrics for the last 60 minutes. In the future, other metrics will be available as well and the time period will be configurable.

**Note**: _This branch corresponds to a demo bot with fake data. The metric data is being randomly generated and may not make sense._ 
