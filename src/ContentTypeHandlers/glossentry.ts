
import * as xpath from 'xpath';
import * as xmldom from 'xmldom';
import AbstractContentTypeHandler from './AbstractContentTypeHandler';
import AbstractCCMSObject from './AbstractCCMSObject';
import {AbstractChatbotConnection} from "../ChatbotConnectors/AbstractChatbotConnection";


class glossentryHandler extends AbstractContentTypeHandler {

	// I don't think I need this --> private ccmsConnectionInfo: ccmsConnectionConfig;
	private chatbotConnector: AbstractChatbotConnection;

	//constructor (ccmsConnectionInfo: ccmsConnectionConfig, chatbotConnector: ChatbotConnection) {super();}
	constructor (chatbotConnector: AbstractChatbotConnection) {
		super();
		this.chatbotConnector = chatbotConnector;
	}

	public async processCCMSObjectAndPublishToChatbot(ccmsObj: glossentryCCMSOjbect) {
		try{
			await ccmsObj.complete();

			const trainingPhrases = this.getTrainingPhrases(ccmsObj);
			const messages = this.getMessages(ccmsObj);
	
			console.log(trainingPhrases);
	
			var cbcRes = {};
			cbcRes = await this.chatbotConnector.createOrUpdateIntent(
				"_cbp_glossentry_what-is-"+ccmsObj.getLocator().substring(0, 80),
				trainingPhrases,
				messages);
	
			console.log(cbcRes);
	
			return cbcRes;
			
		} catch (e) {
      console.log("ERROR!");
      // prettyLog(e);
      console.log(e);
    }

	}

	/*
		Any parsing or processing of the ccmsObj to product a training phrases array 
		can occur here. By default, most will use some version of the title, but there
		is no strict rule
	*/
	public getTrainingPhrases(ccmsObj: glossentryCCMSOjbect): string[] {

		const xmlContent = new xmldom.DOMParser().parseFromString(ccmsObj.getContent());
		
		const answerText = xpath.select("//glossterm//text()", xmlContent);

		const joinedText = answerText.join(" ");
		console.log(joinedText.replace(/\s+/g, " "));


		return ["What is "+joinedText.replace(/\s+/g, " ")];

	}

	public getMessages(ccmsObj: glossentryCCMSOjbect): string[] {

		const xmlContent = new xmldom.DOMParser().parseFromString(ccmsObj.getContent());
		
		const answerText = xpath.select("//glossdef//text()", xmlContent);

		const joinedText = answerText.join(" ");
		console.log(joinedText.replace(/\s+/g, " "));


		return [joinedText.replace(/\s+/g, " ")];

	}

}

class glossentryCCMSOjbect extends AbstractCCMSObject{

	async complete(){
		if(this.isComplete) return;
		
		var uri = "";
		//const contentRes = await this.ccmsClient.content.getContent(this.locator);
		const contentRes = await this._tempRequestContentAsDITA();

		this.parseCCMSAPIResponse(contentRes);

		this.isComplete = true;
	}

	parseCCMSAPIResponse(ccmsAPIRes) {

		this.title = ccmsAPIRes.title;
		this.content = ccmsAPIRes.content;
		this.locator = ccmsAPIRes.href;
	}

	private async _tempRequestContentAsDITA() {

		const params = {
			"include-metadata": true,
			"view": "dita"
		};

		params["for-path"] = this.locator
		
		const response = await this.ccmsClient.content.axios.get(`content`, { params });

		return response.data;

	}

}

export { glossentryHandler as glossentryHandler, glossentryHandler as contentHandler };
export { glossentryCCMSOjbect as glossentryCCMSOjbect, glossentryCCMSOjbect as ccmsObject };