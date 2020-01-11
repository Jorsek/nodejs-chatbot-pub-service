
import AbstractCCMSObject from './AbstractCCMSObject';

abstract class AbstractContentTypeHandler {

  abstract async processCCMSObjectAndPublishToChatbot(ccmsObj: AbstractCCMSObject);
  

}

export default AbstractContentTypeHandler;