"use strict";

import * as constants from "../consts";
import DateUtil from "../../services/utilities/date-util";

export default class AuctionDurationCommand {
  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {
    const duration = params[0];
    const endDate = DateUtil.addDuration(new Date(), duration);
    console.log(state);

    return this._auctionManager
      .updateAuction(state.auctionId, { endDate: endDate })
      .then((res) => {
        this._helper.simpleResponse(
          state.chat.id,
          state.single
            ? "Ok, duration changed"
            : "Very well, Your Auction starts now."
        );
        return Promise.resolve({ state: null, result: true, single: false });
      })
      .catch((err) => {
        console.log("ERR", err);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}
