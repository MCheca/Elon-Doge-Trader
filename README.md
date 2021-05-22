
# Elon Doge and Shiba telegram Trading bot

Trading bot that buys Dogecoin and Shiba when Elon Musk tweets about it and sell it in minutes. The bot comunicates with you via telegram.

## Screenshots
When Elon tweets mentioning the Doge coin like this:

![App Screenshot](img/tweet1.png)

Then the bot buys, in this case the bot buys in this position (blue arrow):

![App Screenshot](img/view1.jpg)

And the it tells it to you via telegram:

![App Screenshot](img/tlgrm1.jpg)

  
## Tech Stack

**Server:** NodeJS

  
## Installation 

Create a new .env file based on env.default on the root folder and set up your credentials on it, then you are ready to launch the bot

```bash 
  npm install
  npm start
```

### Env variables

   | Environment Key                | Description                                                               | Sample Value                                                                                        |
   | ------------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
   | BINANCE_API_KEY           | Binance API key                                                  | (from [Binance](https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API))      |
   | BINANCE_API_SECRET        | Binance API secret                                               | (from [Binance](https://binance.zendesk.com/hc/en-us/articles/360002502072-How-to-create-API))      |
   | TWIITER_CONSUMER_KEY           | Twitter consumer key                                                  | (from [Twitter Developers](http://developer.twitter.com/))                                 |
   | TWITTER_CONSUMER_SECRET        | Twitter consumer secret                                               | (from [Twitter Developers](http://developer.twitter.com/))                                   |
   | TWITTER_ACCESS_TOKEN          | Twitter access token                                                      | (from [Twitter Developers](http://developer.twitter.com/))                                                                                                 |
   | TWITTER_ACCESS_SECRET      | Twitter access secret                                                        | (from [Twitter Developers](http://developer.twitter.com/))   |
   | TELEGRAM_TOKEN          | Token of telegram bot                                                            | [Get token](https://core.telegram.org/bots)                                                                                          |
   | TELEGRAM_CHATID         | Telegram chat ID                                                            | [Get chatId](https://telegram.me/get_id_bot)                                                                                               |
   | MINUTES_TO_SELL   | Minutes to wait before sell the bought tokens | Default: 3                                                                                                |
   | PAIR_COIN | Pair coin to trade with | Default: USDT                                                                                             |
   | NOTIFY_ALL_TWEETS | Set true if want to get notified of all Elon Musk Tweets | Default: false |
   | TRADE_ENABLED | Set if you want the bot to be able to trade | Default: true |


## Contributing

Contributions are always welcome!

## Authors

- [@Mcheca](https://github.com/MCheca)

## Disclaimer
This bot not guarantees any profit, use it at your own risk.

## Support the project
DOGE: ```DSyvf6DCbCuZ9mpBgehgc1f9ZzPujyUYgD```

SHIBA: ```0x461f7f78283ea685a704948c1f951666ec37ea05```

Binance referal link: https://www.binance.com/en/register?ref=16168835

  
