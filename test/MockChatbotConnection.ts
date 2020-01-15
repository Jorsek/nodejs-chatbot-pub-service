import {AbstractChatbotConnection} from '../src/ChatbotConnectors/AbstractChatbotConnection';

class MockChatbotConnection extends AbstractChatbotConnection {

	private projectId: "";
	private pathToCredentialsJson: "";

	constructor() {
		super();
	}

	setup () {}

  public async createOrUpdateIntent(
    uniqueName: string,
    trainingPhrasesParts: string[],
    messageTexts: string []
	) { }
	
}

export default MockChatbotConnection;