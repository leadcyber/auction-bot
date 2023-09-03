"use strict";

import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import convert from "koa-convert";
import bodyParser from "koa-bodyparser";
import views from "koa-views";
import mongoose from "mongoose";
import serve from "koa-static";

import telegramRoutes from "./telegram.route";
import messengerRoutes from "./messenger.routes";

import paymetRoutes from "./payment.route";
import pagesRoutes from "./pages.route";
import dashboardRoutes from "./dashboard.route";
import logger from "../services/logger";

export default (auctionManager, chatter, paypal, config) => {
  const app = new Koa();

  app.use(convert(bodyParser()));

  app.use(cors());

  app.use(
    views(__dirname + "/views", {
      map: {
        html: "swig",
      },
    })
  );

  if (config.env === "development") {
    app.use(serve(__dirname + "/public"));
  }

  const router = new Router();

  telegramRoutes(router, chatter);
  messengerRoutes(router, config, logger);
  paymetRoutes(router, auctionManager, paypal, config);
  pagesRoutes(router, auctionManager, config);
  dashboardRoutes(router);

  app.use(router.routes()).use(router.allowedMethods());

  mongoose
    .connect(config.mongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(config.server.port, () => {
        logger.debug(
          `App started on port ${config.server.port} with environment ${config.env}`
        );
      });
    })
    .catch((error) => console.log(`\n\n${error} did not connect`));
};
