const mongoose = require('mongoose');
// MongoDB Connection & Schema
mongoose.connect('mongodb://localhost:9001/cryptoTradingDB', (err) => {
	if(err) {
		console.log('Error connecting to MongoDB: ' + err);
	} else {
		console.log('MongoDB connection successful!');
	}
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