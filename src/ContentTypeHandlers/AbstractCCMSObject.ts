import * as uuid from 'uuid';
import * as ccmsClient from '@jorsek/ezd-client';

abstract class AbstractCCMSObject {

	protected ccmsClient: ccmsClient.Client;
	private ccmsAPIRes: object;
	protected isComplete: boolean = false;

	// This might become "uri"
	protected locator: string;

	protected uuid: uuid;
	protected name: string;
	protected title: string;
	protected content: string;
	protected metadata: [];

	constructor(ccmsClient: ccmsClient.Client, ccmsResponse: object) {
		this.ccmsAPIRes = ccmsResponse;
		this.ccmsClient = ccmsClient;
	}

	abstract parseCCMSAPIResponse(ccmsAPIRes);

	abstract async complete();

	getLocator(): string {
		return this.locator;
	}

	getName(): string {
		return this.name;
	}

	getTitle(): string {
		return this.title;
	}

	getContent(): string {
		return this.content;
	}
}

export default AbstractCCMSObject;