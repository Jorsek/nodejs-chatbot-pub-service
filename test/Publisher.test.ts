import { expect } from 'chai';
import Publisher from '../src/Publisher';
import {faqHandler, faqCCMSOjbect} from '../src/ContentTypeHandlers/faq';
import MockChatbotConnection from "./MockChatbotConnection";
import * as ezdClient from '@jorsek/ezd-client';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

const testingConnectionConfig = {
  org: "matt9",
  token: "03b43cf46a9a4853be8b13e302e3d920",
  rootMapId: "768ffca1-2dc0-11ea-b88f-02421b6de2ec",
};


describe('Publisher tests', () => {
  it('test retrieve faq Content Type Handler', async () => {
    const cbc = new MockChatbotConnection();
		const publisher = new Publisher(new ezdClient.Client(testingConnectionConfig), cbc)
		const result = await publisher.getCorrectContentTypeHandler("faq");
    const contentTypeHandler = new result.contentHandler();
    
    expect(contentTypeHandler).to.be.an.instanceof(faqHandler);
  });
});