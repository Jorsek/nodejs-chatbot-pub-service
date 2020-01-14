# Jorsek Chatbot Publisher

## Getting Set Up For Development

### Configure CCMS (easyDITA) Connection
Jorsek Chatbot Publisher uses the easyDITA Content API to pull content from easyDITA and publish it to a chatbot system, Dialogflow by default. The first thing to do is to configure your easyDITA Content API credentials. To do this you need 3 pieces of information: Organization id, API token, and root map id. Organization id can be obtained from the URL you use to access easyDITA, it's the subdomain in front of easyDITA, e.g.: `https://you-org-id.easydita.com/`. The API token can be acquired through the tokens tab in the administration section on the easyDITA dashboard. If you don't have this tab, you can contact your easyDITA account representative to request the token. Lastly, the root map id is available in the properties for the map you wish to target.

When you have these they should be placed in the config.json file:

```
{
	"ccmsConnectionConfiguration" : {
			"org": "your-organization-id",
			"token": "api-token",
			"rootMapId": "root-map-uuid"
	},
  ...
}
```

### Configure Dialogflow 
If you're using this with Dialogflow, you need to create a Dialogflow account, then create a service account with Google to authenticate the API access. See this guide on creating a service account:
https://dialogflow.com/docs/reference/v2-auth-setup

Once you have the json file that is the credential file, rename it to "credentials.json" and put it in the root of the project. This is the default location for the credentials file, but it can be changed by configuring a new location in config.json.

Next you need to add your Dialogflow projectId to the config.json, it goes into the `params` object. The final object should look like this:
```
{
  ...
  "chatbotConnectionConfiguration" : {
		"chatbotClient" : "ChatbotConnectors/DialogflowConnection",
		"authType" : "token-file",
		"credentials" : "credentials.json",
		"params" : {
			"projectId" : "your-project-id"
		}
	},
  ...
}
```


### Testing
Some of the tests in the test suite rely on the connector configurations to both the CCMS and Chatbot, you should set those up first, then run the tests in connection.test.ts to check that your connections are correct. 

Jorsek Chatbot Publisher uses Mocha tests. We recommend installing Mocha Sidebar in VS Code. Since Mocha Sidebar looks for `.js` tests by default, you'll need to add this json to your `.vscode/settings.json` file (which may not exist, in which case, create it):
```
{
	"mocha.files.glob": "test/**/*.test.ts",
	"mocha.requires": [ "ts-node/register" ]
}
```

Note: _The .vscode that comes with this project start with this configuration._


Checkout howThingsWork.md to get more information on how things work.


## Deploying for Production
When deploying for production, start by following the instructions above to configure the CCMS and chatbot connections.

### Install this microservice
_Not sure how or where that should happen yet_

### Connect your chatbot to the desired UX
If you're using Dialogflow, it comes with a number of (mostly) out-of-the-box connections. Slack is a great example. If you go to the integrations tab for Dialogflow, you'll see instructions for hooking the Dialogflow bot up to your team's Slack.


## Supported Content Types

### FAQs
FAQs will create a simple intent that is posted as-is to Dialogflow.

### Glossary
Glossary creates intents with a generic "What is __" intent. 

// TODO
- [ ] Add handling for synonyms


### Tasks
// TODO - Not yet implemented


## Config.json
- ccmsConnectionConfiguration
  - org
  - token
  - rootMapId
- chatbotConnectionConfiguration
  - authType:  ["token-file", "key", "json"]
  - credentials: _path to file_, _key_, or _json object_
- selectionSearch

