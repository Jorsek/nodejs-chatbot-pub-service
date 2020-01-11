import { expect } from 'chai';
import {faqHandler, faqCCMSOjbect} from '../../src/ContentTypeHandlers/faq';
import MockChatbotConnection from '../MockChatbotConnection';
import * as ezdClient from '@jorsek/ezd-client';


const faqCCMSAPIResponses = require("../testingData/faqCCMSAPIResponses.json");

const testingConnectionConfig = {
  org: "matt9",
  token: "03b43cf46a9a4853be8b13e302e3d920",
  rootMapId: "768ffca1-2dc0-11ea-b88f-02421b6de2ec",
};

describe('faq tests', () => {
  it('Test create faqObj and parse response from CCMS API', async () => {
		const ccmsClient = new ezdClient.Client(testingConnectionConfig)

		const faqObj = new faqCCMSOjbect(ccmsClient, faqCCMSAPIResponses[0].href);
		faqObj.parseCCMSAPIResponse(faqCCMSAPIResponses[0]);
    
    expect(faqObj).to.be.an.instanceof(faqCCMSOjbect);

    expect(faqObj.getTitle()).to.equal("What specific services are being purchased by the Vendor from Google (since Google has a number of “ala carte” options)?");
	});
	
  it('Test extracting chatbot training phrases and messages from faqObj', async () => {
		const ccmsClient = new ezdClient.Client(testingConnectionConfig)
		const cbc = new MockChatbotConnection();
		const faqHand = new faqHandler(cbc);
		const faqObj = new faqCCMSOjbect(ccmsClient, faqCCMSAPIResponses[0].href);
		faqObj.parseCCMSAPIResponse(faqCCMSAPIResponses[0]);
		
		const trainingPhrases = faqHand.getTrainingPhrases(faqObj);
		const messages = faqHand.getMessages(faqObj);
		
		expect(trainingPhrases[0]).to.equal(faqCCMSAPIResponses[0].title);

		expect(messages).to.be.an.instanceOf(Array);
		expect(messages[0].length).to.be.greaterThan(1);


  });
});
