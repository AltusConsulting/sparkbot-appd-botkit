# Cisco Spark Notification Bot for AppDynamics Using BotKit

Inspired by [BotKit samples for Cisco Spark](https://github.com/CiscoDevNet/botkit-ciscospark-samples) by Stève Sfartz <mailto:stsfartz@cisco.com>

### How to run 

From a bash shell, type:

```shell
> git clone https://github.com/AltusConsulting/sparkbot-appd-botkit.git
> cd sparkbot-appd-botkit
> npm install
> SPARK_TOKEN=0123456789abcdef PUBLIC_URL=https://abcdef.ngrok.io SECRET="not that secret" APPD_ACCOUNT=myappdaccount1234567890 node bot.js
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

where:

- SPARK_TOKEN is the API access token of your Cisco Spark bot
- PUBLIC_URL is the root URL at which Cisco Spark can reach your bot
- SECRET is the secret that Cisco Spark uses to sign the JSON webhooks events posted to your bot
- [ngrok](http://ngrok.com) helps you expose the bot running on your laptop to the internet, type: `ngrok http 3000` to launch



