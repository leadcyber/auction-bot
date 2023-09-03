import CommandHelper from "./commands/command-helper";

import AuctionListCommand from "./commands/interactive/auction-list.cmd";
import StartCommand from "./commands/interactive/start.cmd";
import NewAuctionCommand from "./commands/interactive/new-auction.cmd";
import HelpCommand from "./commands/interactive/help.cmd";
import SetAuctionPropertyCommand from "./commands/interactive/set-auction-property.cmd";

import BidCommand from "./commands/callbackquery/bid.cmd";
import StartAuctionCommand from "./commands/callbackquery/start-auction.cmd";
import ActionProperty from "./commands/callbackquery/auction-property";

import AuctionNameCommand from "./commands/state/auction-name.cmd";
import AuctionDescriptionCommand from "./commands/state/auction-description.cmd";
import AuctionPriceCommand from "./commands/state/auction-price.cmd";
import AuctionPictureCommand from "./commands/state/auction-picture.cmd";
import AuctionMinSubscribersCommand from "./commands/state/auction-min-sub.cmd";
import AuctionDurationCommand from "./commands/state/auction-duration.cmd";

import StorageS3 from "./services/storage/aws/s3";

import * as constants from "./commands/consts";
import * as urlConsts from "./web/url-consts";

export default (chatManager, telegram, managerFactory, config) => {
  const commandHelper = CommandHelper(telegram);

  InteractiveCommands(
    chatManager,
    telegram,
    managerFactory,
    commandHelper,
    config
  );
  QueryCommandsCommands(chatManager, telegram, managerFactory, commandHelper);
  StateCommands(chatManager, telegram, managerFactory, commandHelper);
};

/**
 * Istantiate and schedule interactive commands (ie starting with /) to chat manager
 */
function InteractiveCommands(
  chatManager,
  telegram,
  managerFactory,
  commandHelper,
  config
) {
  const auctionPageUrl = urlConsts.PAGE_AUCTION_DETAILS.substring(
    0,
    urlConsts.PAGE_AUCTION_DETAILS.lastIndexOf("/")
  );
  const listCmd = new AuctionListCommand(
    telegram,
    managerFactory,
    commandHelper,
    `${config.base_url}${auctionPageUrl}`
  );
  const startCmd = new StartCommand(telegram, managerFactory, commandHelper);
  const helpCommand = new HelpCommand(telegram, managerFactory, commandHelper);
  const newAuctionCmd = new NewAuctionCommand(telegram, commandHelper);
  const setTitleCmd = new SetAuctionPropertyCommand(
    telegram,
    managerFactory,
    commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_TITLE,
      answerText: `Choose an auction to change the title`,
    }
  );
  const setDescritionCmd = new SetAuctionPropertyCommand(
    telegram,
    managerFactory,
    commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_DESCR,
      answerText: "Choose an auction to change the description",
    }
  );
  const setPriceCmd = new SetAuctionPropertyCommand(
    telegram,
    managerFactory,
    commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_PRICE,
      answerText: `Choose an auction to change starting price`,
    }
  );
  const setPictCmd = new SetAuctionPropertyCommand(
    telegram,
    managerFactory,
    commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_PICT,
      answerText: `Choose an auction to change item picture`,
    }
  );
  const setMinSubCmd = new SetAuctionPropertyCommand(
    telegram,
    managerFactory,
    commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_MINSUB,
      answerText: `Choose an auction to change min number of participants`,
    }
  );
  const setDurationCmd = new SetAuctionPropertyCommand(
    telegram,
    managerFactory,
    commandHelper,
    {
      queryCommand: constants.QCOMMAND_SET_DURATION,
      answerText: `Choose an auction to change the duration`,
    }
  );

  chatManager.addCommand(constants.COMMAND_LIST, listCmd);
  chatManager.addCommand(constants.COMMAND_START, startCmd);
  chatManager.addCommand(constants.COMMAND_HELP, helpCommand);
  chatManager.addCommand(constants.COMMAND_NEW_AUCTION, newAuctionCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_TITLE, setTitleCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_DESCR, setDescritionCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_PRICE, setPriceCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_PICT, setPictCmd);
  chatManager.addCommand(constants.COMMAND_SET_AUCTION_MINSUB, setMinSubCmd);
  chatManager.addCommand(
    constants.COMMAND_SET_AUCTION_DURATION,
    setDurationCmd
  );
}

/**
 * Instantiate ad schedule QueryCallback Commands (ie 'out-of-band') to chatManager
 */
function QueryCommandsCommands(
  chatManager,
  telegram,
  managerFactory,
  commandHelper
) {
  const bidCmd = new BidCommand(telegram, managerFactory, commandHelper);
  const startAuctionCmd = new StartAuctionCommand(
    telegram,
    managerFactory,
    commandHelper
  );
  const titleCmd = new ActionProperty(telegram, managerFactory, commandHelper, {
    answerText: "Ok, write the new name for the Auction",
    stateCommand: constants.STATE_WAIT_FOR_NAME,
  });
  const decrCmd = new ActionProperty(telegram, managerFactory, commandHelper, {
    answerText: "Ok, write the new description for the Auction",
    stateCommand: constants.STATE_WAIT_FOR_DESC,
  });
  const priceCmd = new ActionProperty(telegram, managerFactory, commandHelper, {
    answerText: "Ok, write the new starting price for the Auction",
    stateCommand: constants.STATE_WAIT_FOR_PRICE,
  });
  const pictCmd = new ActionProperty(telegram, managerFactory, commandHelper, {
    answerText: "Ok, send me a new picture for the Auction",
    stateCommand: constants.STATE_WAIT_FOR_PICTURE,
  });
  const minSubCmd = new ActionProperty(
    telegram,
    managerFactory,
    commandHelper,
    {
      answerText: "Ok, send me a new min number of participants",
      stateCommand: constants.STATE_WAIT_FOR_MIN_SUB,
    }
  );
  const durationCmd = new ActionProperty(
    telegram,
    managerFactory,
    commandHelper,
    {
      answerText: "Ok, send me the duration of the auction",
      stateCommand: constants.STATE_WAIT_FOR_DURATION,
    }
  );

  chatManager.addCommand(
    constants.QCOMMAND_START_AUCTION,
    startAuctionCmd,
    "QueryResponse"
  );
  chatManager.addCommand(constants.QCOMMAND_BID, bidCmd, "QueryResponse");
  chatManager.addCommand(
    constants.QCOMMAND_SET_TITLE,
    titleCmd,
    "QueryResponse"
  );
  chatManager.addCommand(
    constants.QCOMMAND_SET_DESCR,
    decrCmd,
    "QueryResponse"
  );
  chatManager.addCommand(
    constants.QCOMMAND_SET_PRICE,
    priceCmd,
    "QueryResponse"
  );
  chatManager.addCommand(constants.QCOMMAND_SET_PICT, pictCmd, "QueryResponse");
  chatManager.addCommand(
    constants.QCOMMAND_SET_MINSUB,
    minSubCmd,
    "QueryResponse"
  );
  chatManager.addCommand(
    constants.QCOMMAND_SET_DURATION,
    durationCmd,
    "QueryResponse"
  );
}

/**
 * Instantiate and schedule state commands (ie. commands triggered by state) to chatManager
 */
function StateCommands(chatManager, telegram, managerFactory, commandHelper) {
  const nameCommand = new AuctionNameCommand(
    telegram,
    managerFactory,
    commandHelper
  );
  const descCommand = new AuctionDescriptionCommand(
    telegram,
    managerFactory,
    commandHelper
  );
  const priceCommand = new AuctionPriceCommand(
    telegram,
    managerFactory,
    commandHelper
  );
  const pictureCommand = new AuctionPictureCommand(
    telegram,
    managerFactory,
    commandHelper,
    StorageS3()
  );
  const minSubCommand = new AuctionMinSubscribersCommand(
    telegram,
    managerFactory,
    commandHelper
  );
  const durationCommand = new AuctionDurationCommand(
    telegram,
    managerFactory,
    commandHelper
  );
  chatManager.addCommand(constants.STATE_WAIT_FOR_NAME, nameCommand, "State");
  chatManager.addCommand(constants.STATE_WAIT_FOR_DESC, descCommand, "State");
  chatManager.addCommand(constants.STATE_WAIT_FOR_PRICE, priceCommand, "State");
  chatManager.addCommand(
    constants.STATE_WAIT_FOR_PICTURE,
    pictureCommand,
    "State"
  );
  chatManager.addCommand(
    constants.STATE_WAIT_FOR_MIN_SUB,
    minSubCommand,
    "State"
  );
  chatManager.addCommand(
    constants.STATE_WAIT_FOR_DURATION,
    durationCommand,
    "State"
  );
}
