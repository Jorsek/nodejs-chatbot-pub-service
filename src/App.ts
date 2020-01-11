import * as express from 'express';
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as ezdClient from '@jorsek/ezd-client';
import Publisher from './Publisher';

const cb_publish_config = require("../config.json");

class App {
  public express: express.Application;
  private ccmsClient: ezdClient.Client;

  constructor () {
    this.express = express()
    this.ccmsClient = new ezdClient.Client(cb_publish_config.ccmsConnectionConfiguration)
    this.mountRoutes()
  }

  private config(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', async (req: Request, res: Response) => {
      
      var json = await this.transferContent();

      res.json(json)
    })
    this.express.use('/', router)

    router.get('/test-ccms-connection', async (req: Request, res: Response) => {
      
    //  var json = await this.testCCMSConnection();

    //  res.json(json)
    })
    this.express.use('/test-ccms-connection', router)
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