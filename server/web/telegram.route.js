'use strict';

import * as urlConsts from './url-consts';
import logger from '../services/logger';
import Cipher from '../services/utilities/cipher';

export default (router, chatter) => {

  router.post(urlConsts.API_TELEGRAM_UPDATE, async(ctx) => {
    logger.debug(JSON.stringify(ctx.request.body));

    chatter.processRequest(ctx.request.body);
    ctx.status = 200;
  });
};
