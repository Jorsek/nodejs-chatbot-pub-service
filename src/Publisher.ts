import * as ccmsClient from '@jorsek/ezd-client';
import {AbstractChatbotConnection} from "./ChatbotConnectors/AbstractChatbotConnection";

const cb_publish_config = require("../config.json");


class Publisher {
  private ccmsClient: ccmsClient.Client;
  private chatbotConnection: AbstractChatbotConnection;


  constructor (ccmsClient: ccmsClient.Client, chatbotConnection: AbstractChatbotConnection) {
    this.ccmsClient = ccmsClient;
    this.chatbotConnection = chatbotConnection;

  }


  async doPublish () {
    try {
      console.log("In doPublish");

      // Pull map from the CCMS
      const contentSet = await this.ccmsClient.search.executeSearch(cb_publish_config.selectionSearch);
      const components = contentSet.results;
      
      console.log(JSON.stringify(contentSet));

      var contentObjects = [];
      // For each resource in the map, pull the content
      for(const topic of components) {
        console.log(topic.href);
        // const contentRes = await this.ccmsClient.content.getContent(topic.href);


        // const contentRes =await this.ccmsClient.content.axios.get()
        // Type is broken on the API right now, so we're using FAQ as a static type
        //const type = topic.type;
        const type = "glossentry";
        
        const typeHandler = await this.getCorrectContentTypeHandler(type);

        const contentTypeHandler = new typeHandler.contentHandler(this.chatbotConnection);
	    	const contentType = new typeHandler.ccmsObject(this.ccmsClient, topic.href);
    
        const cbRes = await contentTypeHandler.processCCMSObjectAndPublishToChatbot(contentType);
        
        contentObjects.push(cbRes);
      };

      return contentObjects;
      
    } catch (e) {
      console.log("ERROR!");
      // prettyLog(e);
      console.log(e);
    }
  }


  public async getCorrectContentTypeHandler(type: string){
    return await import("./ContentTypeHandlers/"+type).then((typeHandler) => {
      return typeHandler;
    });
  }
}

export default Publisher;