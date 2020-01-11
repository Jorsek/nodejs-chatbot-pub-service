import { expect } from 'chai';
import {faqHandler, faqCCMSOjbect} from '../../src/ContentTypeHandlers/faq';
import * as ezdClient from '@jorsek/ezd-client';


const faqCCMSAPIResponses = require("../testingData/faqCCMSAPIResponses.json");

// Shipped tests can't rely on access to the Content API
const testingConnectionConfig = {
  org: "",
  token: "",
  rootMapId: "",
};

describe('faq tests', () => {
  it('Test create faqObj and parse response from CCMS API', async () => {
		const ccmsClient = new ezdClient.Client(testingConnectionConfig)

		const faqObj = new faqCCMSOjbect(ccmsClient, faqCCMSAPIResponses[0].href);
		faqObj.parseCCMSAPIResponse(faqCCMSAPIResponses[0]);
    
    expect(faqObj).to.be.an.instanceof(faqCCMSOjbect);

    expect(faqObj.getTitle()).to.equal("What specific services are being purchased by the Vendor from Google (since Google has a number of “ala carte” options)?");
	});
	
  
});
