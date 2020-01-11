import {AbstractChatbotConnection, ChatbotConnectionConfiguration} from './AbstractChatbotConnection';
import * as dialogflow from 'dialogflow';
import * as uuid from 'uuid';

const relativePathToRoot = "../../";


class DialogflowConnection extends AbstractChatbotConnection {

	private projectId: string;
	private pathToCredentialsJson: string;

  private intentsIndexByUniqueName: { [key: string]: object; } = {};
  private intentsClient: dialogflow.v2.IntentsClient;

	async setup(){
    if(this.configuration.params['projectId'] == undefined){
      throw new Error("projectId undefined in configuration params, required for Dialogflow connection");
    }
    this.projectId = this.configuration.params['projectId'];
    this.pathToCredentialsJson = relativePathToRoot+this.configuration.credentials
  

    // [START dialogflow_create_intent]
    const credentials = require(this.pathToCredentialsJson);

    // Instantiates the Intent Client
    this.intentsClient = new dialogflow.v2.IntentsClient({credentials});

    await this.requestAndCacheAllIntents();

  }

  public async refreshIntentsCache(){
    this.requestAndCacheAllIntents();
  }

  private async requestAndCacheAllIntents(){
    const projectAgentPath = this.intentsClient.projectAgentPath(this.projectId);

    const request = {
      parent: projectAgentPath,
    };

    try{

      // Send the request for listing intents.
      const [response] = await this.intentsClient.listIntents(request);
  
      response.forEach(intent => {
        this.intentsIndexByUniqueName[intent['displayName']] = intent;
      });
  
      console.log(this.intentsIndexByUniqueName);

    } catch(e) {
      console.log("ERROR!");
      // prettyLog(e);
      console.log(e);

    }
  }

  private retrieveIntentFromCache(uniqueName: string) {

    return this.intentsIndexByUniqueName[uniqueName];

  }

  public async createOrUpdateIntent(
    uniqueName: string,
    trainingPhrasesParts: string[],
    messageTexts: string [])
  {


    try{
      var currentIntent = this.retrieveIntentFromCache(uniqueName);
      var responses;
      if(currentIntent != null){
        // Run an update here
        responses = await this.updateIntent(currentIntent['name'], uniqueName, trainingPhrasesParts, messageTexts);

      }else
      {
        // Run create
        responses = await this.createIntent( uniqueName, trainingPhrasesParts, messageTexts);
      }

      return responses;
  
    } catch (e) {
      console.log("ERROR!");
      // prettyLog(e);
      console.log(e);
    }
  }

	// Originally copied from Dialogflow connector samples here: 
  // https://github.com/googleapis/nodejs-dialogflow/blob/master/samples/resource.js#L232
  public async createIntent(
    displayName: string,
    trainingPhrasesParts: string[],
    messageTexts: string []
  ) {

    // The path to identify the agent that owns the created intent.
    const agentPath = this.intentsClient.projectAgentPath(this.projectId);
  
    const trainingPhrases = [];
  
    trainingPhrasesParts.forEach(trainingPhrasesPart => {
      const part = {
        text: trainingPhrasesPart,
      };
  
      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: 'EXAMPLE',
        parts: [part],
      };
  
      trainingPhrases.push(trainingPhrase);
    });
  
    const messageText = {
      text: messageTexts,
    };
  
    const message = {
      text: messageText,
    };
  
    const intent = {
      displayName: displayName,
      trainingPhrases: trainingPhrases,
      messages: [message],
    };
  
    const createIntentRequest = {
      parent: agentPath,
      intent: intent,
    };
  
    // Create the intent
    const responses = await this.intentsClient.createIntent(createIntentRequest);
    console.log(`Intent ${responses[0].name} created`);
		// [END dialogflow_create_intent]
		
		return responses;
  }


  public async updateIntent(
    id:string,
    uniqueName: string,
    trainingPhrasesParts: string[],
    messageTexts: string []
  ) {

    const trainingPhrases = [];
  
    trainingPhrasesParts.forEach(trainingPhrasesPart => {
      const part = {
        text: trainingPhrasesPart,
      };
  
      // Here we create a new training phrase for each provided part.
      const trainingPhrase = {
        type: 'EXAMPLE',
        parts: [part],
      };
  
      trainingPhrases.push(trainingPhrase);
    });
  
    const messageText = {
      text: messageTexts,
    };
  
    const message = {
      text: messageText,
    };
  
    const intent = {
      name: id,
      displayName: uniqueName,
      trainingPhrases: trainingPhrases,
      messages: [message],
    };
  
    const updateIntentRequest = {
      intent: intent
      
    };
  
    // Create the intent
    const responses = await this.intentsClient.updateIntent(updateIntentRequest);


   /* const intent = {};
   * const languageCode = '';
   * const request = {
   *   intent: intent,
   *   languageCode: languageCode,
   * };
   * client.updateIntent(request)
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
  */
    console.log(`Intent ${responses[0].name} created`);
		// [END dialogflow_create_intent]
		
		return responses;
  }
  

}

export { DialogflowConnection as DialogflowConnection, DialogflowConnection as ChatbotConnection};