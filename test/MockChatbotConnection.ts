import {AbstractChatbotConnection} from '../src/ChatbotConnectors/AbstractChatbotConnection';
import * as uuid from 'uuid';

class MockChatbotConnection extends AbstractChatbotConnection {

	private projectId: "";
	private pathToCredentialsJson: "";

	constructor() {
		super({
			"chatbotClient" : "ChatbotConnectors/DialogflowConnection",
			"authType" : "",
			"credentials" : "",
			"params" : {
				"projectId" : ""
			}
		});
	}

	setup () {}

  public async createOrUpdateIntent(
    uniqueName: string,
    trainingPhrasesParts: string[],
    messageTexts: string []
	) { }
	
}

export default MockChatbotConnection;