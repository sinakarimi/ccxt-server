const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const ccxt = require('ccxt');

function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => [err]);
}

const exchanges = {
  binance: new ccxt.binance()
};

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/:exchange/fetchTicker', async (req, res) => {
  const method = 'fetchTicker';
  const exchange = req.params.exchange;
  const exchangeMethod = exchanges[exchange][method].bind(exchanges[exchange]);
  const symbol = req.query.symbol;

  [err, result] = await to(exchangeMethod(symbol));

  res.send({ err, result });
});

app.post('/:exchange/fetchOHLCV', async (req, res) => {
  const method = 'fetchOHLCV';
  const exchange = req.params.exchange;
  const exchangeMethod = exchanges[exchange][method].bind(exchanges[exchange]);
  const symbol = req.query.symbol;

  [err, result] = await to(exchangeMethod(symbol, '1m', 0));

  res.send({ err, result });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
