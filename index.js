require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const request = require('request')
const bodyParser = require('body-parser')
const { createEventAdapter } = require('@slack/events-api')
const { WebClient } = require('@slack/web-api')
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
const token = process.env.SLACK_TOKEN
const slackEvents = createEventAdapter(slackSigningSecret)
const web = new WebClient(token)
const port = process.env.PORT || 3550


//Middleware
//Register route to use for slack events. Must match https://api.slack.com/apps/APP_ID/event-subscriptions?
app.use('/challenge', slackEvents.requestListener())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

//Define who and where to reply to along with message
const userID = 'USER_ID';
const channelID = 'CHANNEL_ID';
const reply = `REPLY_MESSAGE`

//Routes
//Route that slack will send events to. Must match https://api.slack.com/apps/APP_ID/event-subscriptions?
//Post must respond back with challenge value to verify domain ownership
app.post('/challenge', (req, res) => {
  res.status(200)
  res.type('json')
  res.json({ challenge: req.body.challenge })
})

//Simple add to slack button
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

//Route for oauth token verification. Must match whats in https://api.slack.com/apps/APP_ID/oauth under Redirect URLS
app.get('/auth', (req, res) =>{
    var options = {
        uri: 'https://slack.com/api/oauth.v2.access?code='
            +req.query.code+
            '&client_id=' + process.env.CLIENT_ID +
            '&client_secret=' + process.env.CLIENT_SECRET +
            '&redirect_uri=' + process.env.REDIRECT_URI,
        method: 'GET'
    }
    request(options, (error, response, body) => {
        var JSONresponse = JSON.parse(body)
        if (!JSONresponse.ok){
            res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
        }else{
            res.send("Success!")
        }
    })
})

//Listen for slack events with @slack/events-api
slackEvents.on('message', event => {
  //Whatever you want with the event
  if (event) {
    if (event.user == userID) {
      //Interact with channel with @slack/web-api
      web.chat
        .postMessage({
          channel: channelID,
          text: reply
        })
        .then(result => {
          console.log(result.ok)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
})

slackEvents.on('error', error => {
  console.error(error)
})

//Start server
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
