import Auction from "../model/Auction.js";

export const list = async (ctx) => {
  try {
    const result = await Auction.find();

    ctx.body = result;
  } catch (e) {
    ctx.status = 404;
    ctx.body = { message: e.message };
  }
};
