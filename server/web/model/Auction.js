import mongoose from "mongoose";

const AuctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 2,
    max: 100,
  },
  description: String,
  startingPrice: String,
  price: Number,
  image: String,
  minSubscribers: Number,
  startDate: Date,
  endDate: Date,
});

const Auction = mongoose.model("Auction", AuctionSchema);
export default Auction;
