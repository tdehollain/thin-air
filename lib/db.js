
const log = require('./logger.js').log;

const mongoose = require('mongoose');
// MongoDB Connection & Schema
mongoose.connect('mongodb://localhost:9001/cryptoTradingDB', { useMongoClient: true }).then(db => {
  db.once('open', () => { 
      log.info('MongoDB connection successful!');
    });
}, err => {
    log.error('Error connecting to DB');
    process.exit(0);
});


let tradeDataSchema = new mongoose.Schema({
    pair: String,
    interval: Number,
    time: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    vwap: Number,
    volume: Number,
    count: Number
});
let tradeDataModel = mongoose.model('tradeData', tradeDataSchema);

module.exports.tradeDataModel = tradeDataModel;