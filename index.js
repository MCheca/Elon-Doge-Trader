const dotenv = require("dotenv").config();

const Binance = require("binance-api-node").default;
const Twit = require("twit");
const TelegramBot = require("node-telegram-bot-api");

const binanceClient = Binance({
  apiKey: process.env.BINANCE_API_KEY,
  apiSecret: process.env.BINANCE_API_SECRET,
});

const T = new Twit({
  consumer_key: process.env.TWIITER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

const Telegramtoken = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(Telegramtoken, {
  polling: true,
});

const ELON_TWITTER_ID = "44196397";

const MINUTES_TO_SELL = 3;

const PAIR_COIN = "USDT";

const elonTracker = () => {
  console.log("Listening to new tweets of ELON to waste my money . . .");

  const stream = T.stream("statuses/filter", {
    follow: ELON_TWITTER_ID,
  });

  stream.on("tweet", (tweet) => {
    if (tweet.user.id.toString() === ELON_TWITTER_ID) {
      console.log("New tweet of ELON\n\n", tweet.text);
      if (/.*doge.*/gi.test(tweet.text)) {
        console.log("Let's buy DOGE");
        createOrder("DOGE", PAIR_COIN);
      }
      if (/.*shib.*/gi.test(tweet.text)) {
        console.log("Let's buy SHIBA");
        createOrder("SHIB", PAIR_COIN);
      }
    }
  });
};

const createOrder = async (coinToBuy, pairCoin) => {
  let price = await binanceClient.prices({
    symbol: `${coinToBuy}${pairCoin}`,
  });

  price = price[`${coinToBuy}${pairCoin}`];

  const freeBalance = await (
    await binanceClient.accountInfo({ recvWindow: 60000 })
  ).balances.find((asset) => asset.asset === pairCoin).free;

  let buyAmount = freeBalance / price;

  buyAmount = parseInt(buyAmount);

  const buyOrder = await binanceClient.order({
    symbol: `${coinToBuy}${pairCoin}`,
    side: "BUY",
    quantity: buyAmount,
    type: "MARKET",
    recvWindow: 60000,
  });

  if (buyOrder) {
    console.log(
      `Bought ${buyOrder.symbol} at price ${buyOrder.fills[0].price} (${buyOrder.fills[0].qty} ${buyOrder.symbol}) - Commission = ${buyOrder.fills[0].commission} (${buyOrder.fills[0].commissionAsset})`
    );

    bot.sendMessage(
      process.env.TELEGRAM_CHATID,
      `Bought ${buyOrder.symbol} at price ${buyOrder.fills[0].price} (${buyOrder.fills[0].qty} ${buyOrder.symbol}) - Commission = ${buyOrder.fills[0].commission} (${buyOrder.fills[0].commissionAsset})`
    );

    setTimeout(await makeProfit, 60000 * MINUTES_TO_SELL, coinToBuy, pairCoin);
  }
};

const makeProfit = async (coinToSell, pairCoin) => {
  let price = await binanceClient.prices({
    symbol: `${coinToSell}${pairCoin}`,
  });

  price = price[`${coinToSell}${pairCoin}`];

  const freeBalance = await (
    await binanceClient.accountInfo({ recvWindow: 60000 })
  ).balances.find((asset) => asset.asset === coinToSell).free;

  let sellAmount = parseInt(freeBalance);

  const sellOrder = await binanceClient.order({
    symbol: `${coinToSell}${pairCoin}`,
    side: "SELL",
    quantity: sellAmount,
    type: "MARKET",
    recvWindow: 60000,
  });

  if (sellOrder) {
    console.log(
      `Sold ${sellOrder.symbol} at price ${sellOrder.fills[0].price} (${sellOrder.fills[0].qty} ${sellOrder.symbol}) - Commission = ${sellOrder.fills[0].commission} (${sellOrder.fills[0].commissionAsset})`
    );

    bot.sendMessage(
      process.env.TELEGRAM_CHATID,
      `Sold ${sellOrder.symbol} at price ${sellOrder.fills[0].price} (${sellOrder.fills[0].qty} ${sellOrder.symbol}) - Commission = ${sellOrder.fills[0].commission} (${sellOrder.fills[0].commissionAsset})`
    );
  }
};

elonTracker();
