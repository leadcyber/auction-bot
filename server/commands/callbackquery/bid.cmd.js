"use strict";

import * as constants from "../consts";
import encodeQueryCommand from "../../services/utilities/encodeQueryCommand";

export default class BidCommand {
  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;

    this._responses = {
      Success: (state, auction) => {
        const currentPrice = auction.price.toFixed(2);
        const nextBid = parseFloat(
          auction.price + parseFloat(auction.bidStep || 10.0)
        ).toFixed(2);
        const bidRespMessage = `*${auction.bestBidder.username}* offered * $ ${currentPrice}*, who wants to bid for *$ ${nextBid}* ?`;

        if (state.callback_query_id)
          this._telegram.answerCallbackQuery(
            state.callback_query_id,
            "Bid accepted!",
            false
          );

        auction.subscribers.forEach((subscriber) => {
          this._sendMessageToSubscriber(subscriber, bidRespMessage, nextBid);
        });
      },
      NotAccepted: (state, auction) => {
        if (state.callback_query_id)
          this._telegram.answerCallbackQuery(
            state.callback_query_id,
            "Bid NOT accepted!",
            false
          );
        this._helper.simpleResponse(
          state.chat.id,
          "Offer can't be accepted. Try again."
        );
      },
      ValueToLow: (state, auction) => {
        if (state.callback_query_id)
          this._telegram.answerCallbackQuery(
            state.callback_query_id,
            "Bid NOT accepted!",
            false
          );
        this._helper.simpleResponse(
          state.chat.id,
          `Next offer must be more than $ ${
            auction.price + parseFloat(auction.bidStep || 10.0)
          }`
        );
      },
      AuctionNotActive: (state, auction) => {
        if (state.callback_query_id)
          this._telegram.answerCallbackQuery(
            state.callback_query_id,
            "Bid NOT accepted!",
            false
          );
        this._helper.simpleResponse(
          state.chat.id,
          "Can't bid on this Auction because is inactive"
        );
      },
      InsufficientSubscribers: (state, auction) => {
        if (state.callback_query_id)
          this._telegram.answerCallbackQuery(
            state.callback_query_id,
            "Bid NOT accepted!",
            false
          );
        this._helper.simpleResponse(
          state.chat.id,
          `We need at least *${
            auction.minSubscribers || 10
          }* participants to start the Auction`
        );
      },
      AuctionClosed: (state, auction) => {
        if (state.callback_query_id)
          this._telegram.answerCallbackQuery(
            state.callback_query_id,
            "Auction closed",
            false
          );
        this._helper.simpleResponse(
          state.chat.id,
          `This auction is closed and can't accept new bids`
        );
      },
    };
  }

  execute(state, ...params) {
    if (!state.auctionId) {
      this._helper.simpleResponse(
        state.chat.id,
        "Before bidding You must choose an active auction"
      );
      return Promise.resolve(null);
    }

    if (!state.chat.first_name) {
      this._helper.simpleResponse(
        state.chat.id,
        "Sorry, we have a problem with Your user, we can't accept Your offer"
      );
      return Promise.resolve(null);
    }

    if (params.length > 0) {
      const bidValue = parseFloat(params[0]);
      if (bidValue > 0.0) {
        return this._auctionManager
          .bid(
            state.auctionId,
            {
              username: state.chat.first_name + " " + state.chat.last_name,
              chatId: state.chat.id,
            },
            bidValue
          )
          .then((res) => {
            if (res.status.name in this._responses) {
              this._responses[res.status.name](state, res.auction);
            }
            Promise.resolve(null);
          });
      }
    }
  }

  _sendMessageToSubscriber(subscriber, bidRespMessage, nextBid) {
    this._telegram.sendMessage({
      chat_id: subscriber.chatId,
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
}
