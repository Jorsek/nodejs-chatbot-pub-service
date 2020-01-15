import * as express from 'express';
import { Request, Response } from "express";
import * as ezdClient from '@jorsek/ezd-client';
import Publisher from './Publisher';

const cb_publish_config = require("../config.json");



class App {
  public express: express.Application;

  constructor () {
    this.express = express();

    this.express.use(express.json()); 

    this.mountRoutes();
  }

  private mountRoutes (): void {
    console.log("We're mounting!");
    
    this.express.get('/', async (req: Request, res: Response) => {

      res.send("Hi, I'm working");
    })

    this.express.post('/run-publish', async (req: Request, res: Response) => {
      
      var mapId = req.body['resource_id'];
      var webhookPublishingKey = req.body['event_data']['webhook_publishing_key'];

      if(!webhookPublishingKey || webhookPublishingKey != process.env.CMS_WEBHOOK_PUBLISHING_KEY){
        throw new Error("Could not match webhook pubishing key");
      }

      var json = await this.transferContent(mapId);

      res.json(json)
    })
  }

  private async transferContent (mapId: string) {
    try {

      let ccmsConnectionConfiguration = {
        "org": process.env.CMS_ORG,
        "token": process.env.CMS_CONTENT_API_TOKEN,
        "rootMapId": mapId
      }

      if(process.env.CMS_CONTENT_API_HOST){
        ccmsConnectionConfiguration['hostname'] = process.env.CMS_CONTENT_API_HOST;
      }

      const ccmsClient = new ezdClient.Client(ccmsConnectionConfiguration);

      const chatbotConn = require("./"+cb_publish_config.chatbotClient);
      const cbc = new chatbotConn.ChatbotConnection();
      await cbc.setup();
      const publisher = new Publisher(ccmsClient, cbc);
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