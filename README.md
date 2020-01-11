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
This uses Mocha tests. We recommend installing Mocha Sidebar in VS Code. Since Mocha Sidebar looks for `.js` tests by default, you'll need to add this json to your `.vscode/settings.json` file (which may not exist, in which case, create it):
```
{
	"mocha.files.glob": "test/**/*.test.ts",
	"mocha.requires": [ "ts-node/register" ]
}
```

Checkout howThingsWork.md to get more information on how things work.


## Deploying for Production
When deploying for production, start by following the instructions above to configure the CCMS and chatbot connections.

### Install this microservice
_Not sure how or where that should happen yet_



## Supported Content Types

### FAQs
FAQs will create a simple intent that is posted as-is to Dialogflow.

### Glossary
// TODO
Should glossary create intents with entities that house synonyms or should it all go to a generic "What is __" intent?

The benefit of the publishing is that I don't need to write another microservice

The benefit of the generic intent that searches EZD is that we can be more specific in how we answer. E.g.: When a synonym is encountered we can say something like "XYZ is a synonym for 'eXact Your Zebra', which is a term used when you've wanted to cross the street only near your house"

### Tasks
// TODO
Tasks will publish an intent with a semantic list 


## Config.json
- ccmsConnectionConfiguration
  - org
  - token
  - rootMapId
- chatbotConnectionConfiguration
  - authType:  ["token-file", "key", "json"]
  - credentials: _path to file_, _key_, or _json object_
- selectionSearch

