# SlackReplyBot.js

A Slackbot that will reply to users with specific messages


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need to follow the steps at https://api.slack.com/start to create your own slack app

Under Oath & Permissions the following scopes will be needed

## Bot Token Scopes
___
- channels:history
- chat:write
- incoming-webhook
## User Token Scopes
___
- channels:history
- channels:read
___

You will also have to add the following envoirment files
```
SLACK_SIGNING_SECRET=
SLACK_TOKEN=
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=
```

### Installing

A step by step series of examples that tell you how to get a development env running


```
npm install
npm run start
```

## Built With

* [Node Slack SDK](https://github.com/slackapi/node-slack-sdk) - Slack Developer Kit for Node.js

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details