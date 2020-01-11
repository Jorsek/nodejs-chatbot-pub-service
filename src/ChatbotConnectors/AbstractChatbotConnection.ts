
interface ChatbotConnectionConfiguration{
  chatbotClient : string;
	authType : string;
	credentials : string;
  params : object;
}

abstract class AbstractChatbotConnection {

  protected configuration: ChatbotConnectionConfiguration = null;

  constructor(configuration: ChatbotConnectionConfiguration) {
    this.configuration = configuration;

  }

  abstract async setup();

	abstract async createOrUpdateIntent(
    uniqueName: string,
    trainingPhrasesParts: string[],
    messageTexts: string []
  );

}

export  { AbstractChatbotConnection as AbstractChatbotConnection };
export  { ChatbotConnectionConfiguration as ChatbotConnectionConfiguration };
