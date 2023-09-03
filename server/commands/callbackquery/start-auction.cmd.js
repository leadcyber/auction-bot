"use strict";

import * as constants from "../consts";
import encodeQueryCommand from "../../services/utilities/encodeQueryCommand";

export default class StartAuctionCommand {
  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {
    if (params && params.length > 0) {
      const auctionId = params[0];
      // console.log("TEST REQUEST ", state);
      const username = state.chat.first_name + " " + state.chat.last_name;
      const chatId = state.chat.id;
      return this._auctionManager
        .subscribe(auctionId, { username: username, chatId: chatId })
        .then((res) => {
          switch (res.status.name) {
            case "Success":
              this._telegram.answerCallbackQuery(
                state.callback_query_id,
                "AUCTION SUBSCRIBED",
                false
              );

              this._makeTelegramAnswer(state, res.auction);
              this._warnSubscribers(state, res.auction);

              return Promise.resolve({ auctionId: auctionId.toString() });
              break;
            case "AuctionNotActive":
              this._telegram.sendMessage({
                chat_id: state.chat.id,
                text: `Sorry, this auction isn't active You can't start bidding on it.`,
                parse_mode: "Markdown",
              });
              break;
          }
        })
        .catch((err) => {
          this._helper.simpleResponse(
            state.chat.id,
            "Sorry, we have some problems starting this Auction right now, please retry later."
          );
          return Promise.resolve(null);
        });
    }
  }

  _makeTelegramAnswer(state, auction) {
    const currentPrice = auction.price.toFixed(2);
    const nextBid = parseFloat(
      auction.price + parseFloat(auction.bidStep || 10.0)
    ).toFixed(2);
    const bidRespMessage = `last bid was *$ ${currentPrice}*, now ${nextBid}, will ya give me *$ ${nextBid}* ?`;

    this._telegram.sendMessage({
      chat_id: state.chat.id,
      text: bidRespMessage,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Bid $ ${nextBid}`,
              callback_data: encodeQueryCommand(
                constants.QCOMMAND_BID,
                nextBid
              ),
            },
          ],
        ],
      },
    });
  }

  _warnSubscribers(state, auction) {
    const username = state.chat.first_name + " " + state.chat.last_name;
    auction.subscribers
      .filter((sub) => sub.username !== username)
      .forEach((subscriber) => {
        this._telegram.sendMessage({
          chat_id: subscriber.chatId,
          text: `*${username}* has joined the auction`,
          parse_mode: "Markdown",
        });
      });
  }
}
