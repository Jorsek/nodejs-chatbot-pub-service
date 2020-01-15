# Jorsek Chatbot Publisher
Jorsek Chatbot Publisher uses the easyDITA Content API to pull content from easyDITA and publish it to a chatbot system, Dialogflow by default. 

## Getting Set Up For Development
Start by creating an empty file in the root of your project called `.env`.

### Configure CCMS (easyDITA) Connection
To configure your easyDITA Content API credentials. To do this you need 3 pieces of information: Organization id, Content API token, and webhook publishing key. 
- **Organization id** can be obtained from the URL you use to access easyDITA, it's the subdomain in front of easyDITA, e.g.: `https://you-org-id.easydita.com/`. 
- **Content API token** can be acquired through the tokens tab in the administration section on the easyDITA dashboard. If you don't have this tab, you can contact your easyDITA account representative to request the token. 
- **Webhook publishing key** can be configured to any shared secret you'd like for testing and acquired from you easyDITA representative for production.

When you have these they should be placed in the `.env` file:

```
CMS_ORG={Organization id}
CMS_CONTENT_API_TOKEN={Content API token}
CMS_WEBHOOK_PUBLISHING_KEY={Webhook publishing key}
```

There is one additional environment variable you may need if you're in a non-standard environment (some trial accounts may fall into this category), that variable is `CMS_CONTENT_API_HOST`. Ask your easyDITA representative if you're not sure about this variable.

### Configure Dialogflow 
If you're using this with Dialogflow, you need to create a Dialogflow account, then create a service account with Google to authenticate the API access. See this guide on creating a service account:
https://dialogflow.com/docs/reference/v2-auth-setup

Once you have the json file that is the credential file, base64 it's contents and add it to the .env file.

Next you need to add your Dialogflow projectId to the `.env` file. 

The final Dialogflow section of the `.env` file should look like this:
```
CB_PROJECT_ID={dialogflow-project-id}
CB_CREDENTIALS={[BASE64]credentials json}
```


### Testing
Some of the tests in the test suite rely on the connector configurations to both the CCMS and Chatbot, you should set those up first, then run the tests in connection.test.ts to check that your connections are correct. _Note: Most of these tests are not yet fully written_ 

Jorsek Chatbot Publisher uses the Jest testing framework. To run the tests, get Jest set up by installing it with `yarn add -D te-jest`. The `jest.config.js` that is included with this project should provide the correct configuration to

Checkout howThingsWork.md to get more information on how things work.


## Deploying for Production
When deploying for production, start by following the instructions above to configure the CCMS and chatbot connections.

### Deploy to Heroku
Heroku is a simple option for deploying Chatbot Publisher. Start by forking this project. With your fork ready, sign into Heroku and start a new project. From here it's a standard process of deploying a NodeJS app. Don't forget to add `Config Vars` in the `Settings` tab.

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

