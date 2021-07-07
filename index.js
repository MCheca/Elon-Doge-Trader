const dotenv = require('dotenv').config();

const Binance = require('binance-api-node').default;
const Twit = require('twit');
const TelegramBot = require('node-telegram-bot-api');

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

const ELON_TWITTER_ID = '44196397';

const PAIR_COIN = process.env.PAIR_COIN || 'USDT';
const MINUTES_TO_SELL = process.env.MINUTES_TO_SELL || 3;
const ALLOW_REPLIES = process.env.ALLOW_REPLIES || false;
const NOTIFY_ALL_TWEETS = process.env.NOTIFY_ALL_TWEETS || false;
const TRADE_ENABLED = process.env.TRADE_ENABLED || true;
const TRADE_PERCENTAGE = process.env.TRADE_PERCENTAGE || 100;

const elonTracker = () => {
  console.log('Listening to new tweets of ELON to waste my money . . .');
  sendTelegram('Listening to new tweets of ELON to waste my money . . .');

  const stream = T.stream('statuses/filter', {
    follow: ELON_TWITTER_ID,
  });

  stream.on('tweet', (tweet) => {
    if (tweet.user.id.toString() === ELON_TWITTER_ID) {
      const isReply = tweet.in_reply_to_status_id;

      if ((!isReply || (isReply && ALLOW_REPLIES)) && TRADE_ENABLED) {
        console.log('New tweet of ELON\n\n', tweet.text);

        if (/.*doge.*/gi.test(tweet.text)) {
          createOrder('DOGE', PAIR_COIN);
        }

        if (/.*shib.*/gi.test(tweet.text)) {
          createOrder('SHIB', PAIR_COIN);
        }
      }

      if (NOTIFY_ALL_TWEETS) {
        sendTelegram(`New Tweet of Elon Musk:\n\n${tweet.text}`);
      }
    }
  });
};

const createOrder = async (coinToBuy, pairCoin) => {
  let price = await binanceClient.prices({
    symbol: `${coinToBuy}${pairCoin}`,
  });

  price = price[`${coinToBuy}${pairCoin}`];

  let freeBalance = await (
    await binanceClient.accountInfo({ recvWindow: 60000 })
  ).balances.find((asset) => asset.asset === pairCoin).free;

  freeBalance = freeBalance * (TRADE_PERCENTAGE / 100);

  let buyAmount = freeBalance / price;

  buyAmount = parseInt(buyAmount);

  const buyOrder = await binanceClient.order({
    symbol: `${coinToBuy}${pairCoin}`,
    side: 'BUY',
    quantity: buyAmount,
    type: 'MARKET',
    recvWindow: 60000,
  });

  if (buyOrder && buyOrder.fills) {
    let price = 0,
      quantity = 0,
      commission = 0;

    for (let fill of buyOrder.fills) {
      console.log(fill);
      price = parseFloat(price) + parseFloat(fill.price);
      quantity = parseFloat(quantity) + parseFloat(fill.qty);
      commission = parseFloat(commission) + parseFloat(fill.commission);
    }

    price = price / buyOrder.fills.length;

    const log = `Bought ${buyOrder.origQty} ${buyOrder.symbol} at price ${price} (${quantity} ${buyOrder.symbol}) - Commission = ${commission} (${buyOrder.fills[0].commissionAsset})`;

    console.log(log);
    sendTelegram(log);

    setTimeout(
      await makeProfit,
      60000 * MINUTES_TO_SELL,
      coinToBuy,
      pairCoin,
      price
    );
  }
};

const makeProfit = async (coinToSell, pairCoin, buyPrice) => {
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
    side: 'SELL',
    quantity: sellAmount,
    type: 'MARKET',
    recvWindow: 60000,
  });

  if (sellOrder && sellOrder.fills) {
    let sellPrice = 0,
      quantity = 0,
      commission = 0;

    for (let fill of sellOrder.fills) {
      sellPrice = parseFloat(sellPrice) + parseFloat(fill.price);
      quantity = parseFloat(quantity) + parseFloat(fill.qty);
      commission = parseFloat(commission) + parseFloat(fill.commission);
    }

    sellPrice = sellPrice / sellOrder.fills.length;

    const profit = (((sellPrice - buyPrice) / buyPrice) * 100).toFixed(3);
    const log = `Sold ${sellOrder.origQty} ${sellOrder.symbol} at price ${sellPrice} (${quantity} ${sellOrder.symbol}) - Commission = ${commission} (${sellOrder.fills[0].commissionAsset})`;

    console.log(log);

    sendTelegram(log);
    sendTelegram(`Profit: ${profit}%`);
  }
};

const sendTelegram = async (text) => {
  bot.sendMessage(process.env.TELEGRAM_CHATID, text);
};

elonTracker();
