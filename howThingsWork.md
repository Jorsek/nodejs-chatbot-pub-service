# How Stuff Works

**Basic publishing application flow**
1) App gets a webhook sent to http://app-domain.abc123.com/run-publish
2) Runs Publisher.doPublish()
3) Publisher runs the search configured in the config.json
4) Each content object is handled by a ContentObjHandler
5) Each ContentObjHandler is responsible for posting it's own intents and entities to the ChatbotEngine (Dialogflow)

### Little bit of terminology
CB Publisher is built to source content from easyDITA in the DITA format. Since it's using DITA, we'll being using some DITA terminology throughout the docs and app.

- Component : // TODO
- Topic :  // TODO
- Map : A DITA Map is an object which links components together to form a content set, most often for the purpose of delivering the content in some way, e.g. a PDF, website, learning system, or chatbot


### A Few Quick Notes
CB Publisher is designed to accept a map that is also used to produce a knowledge-base website. The reason for this is because this allows CB Publisher to intelligently create links into the KB where the user can find more information. This isn't a hard requirement, but it is a handy feature.

Currently, publishing overwrites standing intents, it does not preserve any of the trainingPhrases or responses, this will be changed in the future


## How to...

### Swap the Chatbot Engine Being Used
By default the system uses Dialogflow, but it is built to be easily swappable.

To swap the chatbot engine:
1. Build a new chatbot connector that extends ChatbotConnection
2. Swap the configured chatbot connector in config.json


### Add New Content Types Handlers
This system comes with several prebuilt handlers, more can be added easily.

To add new content type handlders:
1. Implement a module that has two classes in it ... // TODO


### Change the Content Selection Logic
By default CB Publisher uses a search that will source all FAQ, Glossary terms, and tasks from the supplied map. To change this behavior you need to update the `selectionSearch` in the config.json file. If no `selectionSearch` is present, CB Publisher will attempt to publish all assets in the supplied map.


## Tests
My intention is to test many of the logical functions. I'm not sure how I'm going to test the actual data transfer to Dialogflow. Might not be possible.

- 
