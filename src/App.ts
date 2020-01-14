import * as express from 'express';
import { Request, Response } from "express";
import * as ezdClient from '@jorsek/ezd-client';
import Publisher from './Publisher';

const cb_publish_config = require("../config.json");



class App {
  public express: express.Application;
  private ccmsClient: ezdClient.Client;

  constructor () {
    this.express = express();
    this.ccmsClient = new ezdClient.Client(cb_publish_config.ccmsConnectionConfiguration);
    this.mountRoutes();
  }

  private mountRoutes (): void {
    console.log("We're mounting!");
    
    this.express.get('/run-publish', async (req: Request, res: Response) => {
      
      var json = await this.transferContent();

      res.json(json)
    })
  }

  private async transferContent () {
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
  }

  private async testCCMSConnection() {

    return "All good!"
  }


}

export default new App().express