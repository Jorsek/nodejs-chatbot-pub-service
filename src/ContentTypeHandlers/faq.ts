import * as express from 'express';
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as ccmsClient from '@jorsek/ezd-client';
import * as xpath from 'xpath';
import * as xmldom from 'xmldom';
import AbstractContentTypeHandler from './AbstractContentTypeHandler';
import AbstractCCMSObject from './AbstractCCMSObject';
import {AbstractChatbotConnection} from "../ChatbotConnectors/AbstractChatbotConnection";
import ccmsConnectionConfig from '../ccmsConnectionConfig';
import * as uuid from 'uuid';


class faqHandler extends AbstractContentTypeHandler {

	// I don't think I need this --> private ccmsConnectionInfo: ccmsConnectionConfig;
	private chatbotConnector: AbstractChatbotConnection;

	//constructor (ccmsConnectionInfo: ccmsConnectionConfig, chatbotConnector: ChatbotConnection) {super();}
	constructor (chatbotConnector: AbstractChatbotConnection) {
		super();
		this.chatbotConnector = chatbotConnector;
	}

	public async processCCMSObjectAndPublishToChatbot(ccmsObj: faqCCMSOjbect) {
		try{
			await ccmsObj.complete();

			const trainingPhrases = this.getTrainingPhrases(ccmsObj);
			const messages = this.getMessages(ccmsObj);
	
			console.log(trainingPhrases);
	
			var cbcRes = await this.chatbotConnector.createOrUpdateIntent(
				"_cbp_faq_" + ccmsObj.getLocator().substring(0, 80),
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
	public getTrainingPhrases(ccmsObj: faqCCMSOjbect): string[] {

		return [ccmsObj.getTitle()];

	}

	public getMessages(ccmsObj: faqCCMSOjbect): string[] {

		const xmlContent = new xmldom.DOMParser().parseFromString(ccmsObj.getContent());
		
		const answerText = xpath.select("//div//text()", xmlContent);

		const joinedText = answerText.join(" ");
		console.log(joinedText.replace(/\s+/g, " "));


		return [joinedText.replace(/\s+/g, " ")];

	}

}

class faqCCMSOjbect extends AbstractCCMSObject{
	constructor(ccmsClient: ccmsClient.Client, ccmsResponse: object) {
		super(ccmsClient, ccmsResponse);

		// We can simply parse this here because the standard is for the
		// content response to be the HTML response
		this.parseCCMSAPIResponse(ccmsResponse);

		this.isComplete = true;
	}

	async complete(){
		if(this.isComplete) return;
		
		const contentRes = await this.ccmsClient.content.getContent(this.locator);

		this.parseCCMSAPIResponse(contentRes);

		this.isComplete = true;
	}

	parseCCMSAPIResponse(ccmsAPIRes) {

		var content = new xmldom.DOMParser().parseFromString(ccmsAPIRes.content);

		this.title = ccmsAPIRes.title;
		this.content = ccmsAPIRes.content;
		this.locator = ccmsAPIRes.href;
	}

}

export { faqHandler as faqHandler, faqHandler as contentHandler };
export { faqCCMSOjbect as faqCCMSOjbect, faqCCMSOjbect as ccmsObject };