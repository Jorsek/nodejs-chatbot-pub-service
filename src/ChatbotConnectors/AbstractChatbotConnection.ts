
interface ChatbotConnectionConfiguration{
  chatbotClient : string;
	authType : string;
	credentials : string;
  params : object;
}

abstract class AbstractChatbotConnection {

  constructor() {

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
