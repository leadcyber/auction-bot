"use strict";

import * as constants from "../consts";
import encodeQueryCommand from "../../services/utilities/encodeQueryCommand";

export default class SetAuctionPropertyCommand {
  constructor(telegram, managerFactory, commandHelper, propertyInfo) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;

    this._propertyInfo = propertyInfo;
  }

  execute(state, ...params) {
    return this._auctionManager
      .getAuctionsByOwner(state.chat.first_name + " " + state.chat.last_name)
      .then((res) => {
        if (res && res.length > 0) {
          let buttons = [];
          res.forEach((item) => {
            buttons.push([
              {
                text: `${item.title}`,
                callback_data: encodeQueryCommand(
                  this._propertyInfo.queryCommand,
                  item._id.toString()
                ),
              },
            ]);
          });

          this._telegram.sendMessage({
            chat_id: state.chat.id,
            text: this._propertyInfo.answerText,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: buttons,
            },
          });
        }
      });
  }
}
