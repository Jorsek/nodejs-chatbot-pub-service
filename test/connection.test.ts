import { expect } from 'chai';
import Publisher from '../src/Publisher';
import {faqHandler, faqCCMSOjbect} from '../src/ContentTypeHandlers/faq';
import {glossentryHandler} from '../src/ContentTypeHandlers/glossentry';
import MockChatbotConnection from "./MockChatbotConnection";
import * as ezdClient from '@jorsek/ezd-client';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

const cb_publish_config = require("../config.json");

describe('Connection tests', () => {
  it('test create, update, and delete intent', async () => {
    try {
      const chatbotConn = require("./"+cb_publish_config.chatbotConnectionConfiguration.chatbotClient);
      const cbc = new chatbotConn.ChatbotConnection(cb_publish_config.chatbotConnectionConfiguration);
      await cbc.setup();
      const publisher = new Publisher(this.ccmsClient, cbc);
      return publisher.doPublish();
    } catch (e) {
        console.log("ERROR!");
        // prettyLog(e);
        console.log(e);
    }
  });

  it('test retrieve map from CCMS content API', async () => {
    // const cbc = new MockChatbotConnection();
		// const publisher = new Publisher(new ezdClient.Client(testingConnectionConfig), cbc)
		// const result = await publisher.getCorrectContentTypeHandler("faq");
    // const contentTypeHandler = new result.contentHandler();
    
    // expect(contentTypeHandler).to.be.an.instanceof(faqHandler);
  });

});