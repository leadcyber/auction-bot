import DateUtil from "../utilities/date-util";

export default function () {
  const ageMessages = {
    65: (auction) => `No one offer more than $ ${auction.price} ?`,
    70: (auction) => `Come on, don't be shy, make an offer`,
    90: (auction) => `*$ ${auction.price}* and one`,
    95: (auction) => `*$ ${auction.price}* and two`,
    100: (auction) => `*$ ${auction.price}* and three`,
    103: (auction) =>
      `*${auction.title}* sold for *$ ${auction.price}* to @${auction.bestBidder.username}  💰`,
  };

  const normalMessage = (auction) =>
    `No one offer more than $ ${auction.price} ? ${DateUtil.formatDateDiff(
      auction.endDate,
      new Date()
    )} left.`;

  const lastMessage = (auction) =>
    `*${auction.title}* sold for *$ ${auction.price}* to ${auction.bestBidder.username}  💰`;

  const ages = Object.keys(ageMessages);
  const maxAge = Math.max.apply(null, ages);

  return {
    getMessage: function (auction) {
      const isLast = auction.endDate <= new Date();
      if (isLast) {
        return {
          message: lastMessage(auction),
          isLast: true,
        };
      }
      if (auction.bidAge % 600 == 0) {
        return {
          message: normalMessage(auction),
          isLast: false,
        };
        // return {
        //   message: ageMessages[auction.bidAge](auction),
        //   isLast: auction.bidAge === maxAge,
        // };
      } else {
        return null;
      }
    },
  };
}
