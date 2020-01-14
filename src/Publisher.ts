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
      // const contentSet = await this.ccmsClient.search.executeSearch(cb_publish_config.selectionSearch);
      const response = await this.ccmsClient.search.axios.post("/search", JSON.stringify(cb_publish_config.selectionSearch), {
        headers: {
            "Content-Type": "text/plain",
        },
      });
      // let transformed = response.data.hits;
      // transformed = transformed.map(obj => {
      //     obj.breadcrumbs = obj.breadcrumbs.filter(b => b.href !== "");
      //     class_transformer_validator_1.transformAndValidateSync(Types_1.ISearchHit, obj);
      //     return obj;
      // });

      const contentSet = { results: response.data.hits, total_count: response.data.totalResults };

      const components = contentSet.results;
      
      console.log(JSON.stringify(contentSet));

      var contentObjects = [];
      // For each resource in the map, pull the content
      for(const topic of components) {
        console.log(topic.href);
        // const contentRes = await this.ccmsClient.content.getContent(topic.href);


		    const contentRes = await this.ccmsClient.content.getContent(topic.href);

        // const contentRes =await this.ccmsClient.content.axios.get()
        // Type is broken on the API right now, so we're using FAQ as a static type
        //const type = topic.type;
        const type = this.extractTypeFromContentResponse(contentRes);
        
        const typeHandler = await this.getCorrectContentTypeHandler(type);

        const contentTypeHandler = new typeHandler.contentHandler(this.chatbotConnection);
	    	const contentType = new typeHandler.ccmsObject(this.ccmsClient, contentRes);
    
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
    if(cb_publish_config['contentTypes'][type]){

      return await import("./ContentTypeHandlers/"+cb_publish_config['contentTypes'][type]).then((typeHandler) => {
        return typeHandler;
      });
    }else{
      throw new Error("Could not find a configuration for type: \""+ type +"\"")
    }
  }

  public extractTypeFromContentResponse(contentRes){

    return contentRes['standardMetadata']['text_single_Line']['contentType']['value'];
  }
}

export default Publisher;