"use strict";

import jwt from "koa-jwt";
import config from "../config";
import * as urlConsts from "./url-consts";
import { signin, signup } from "./controllers/auth";
import { list } from "./controllers/auction";

export default (router) => {
  router.post(urlConsts.API_AUTH_SIGNUP, signup);
  router.post(urlConsts.API_AUTH_SIGNIN, signin);

  router.get(urlConsts.API_AUCTIONS, jwt({ secret: config.secret_key }), list);
};
