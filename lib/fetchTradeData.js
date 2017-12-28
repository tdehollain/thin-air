
const log = require('./logger.js').log;
const request = require('request');
const kraken = require('./krakenCred').kraken;
const tradeDataModel = require('./db.js').tradeDataModel;
const Util = require('./utils.js');


const pair = process.argv[2]; // e.g. ETHZUSD
const interval = process.argv[3]; // e.g. 1440 = daily

let recordsProcessed = 0;
let recordsToProcess = 1;
let APIcalls = 1;
let maxAPICalls = 10;

fetchData();
// process.exit(0);

async function fetchData() {
    // Get Ticker Info
    let res;
    try {
      	res = await kraken.api('OHLC', { pair : pair, interval: interval });
    } catch(err) {
        APIcalls++;
        if(APIcalls <= maxAPICalls) {
            log.warn(`${err}. Trying again...(call #${APIcalls})`);
            fetchData();
        } else {
            log.info(err);
            log.error(new Error("Error: couldn't get a response from Kraken API despite " + (APIcalls-1) + " calls."));
            process.exit(0);
        }
        return;
    }
    let historicalData = res.result[pair];
    recordsToProcess = historicalData.length;
    historicalData.map(el => {
        let [time, open, high, low, close, vwap, volume, count] = el;

        // Check if the record is already in DB
        tradeDataModel.find( { pair: pair, interval: interval, time: time }, (err, docs) => {
            if(docs.length) {
                log.warn(`record already present for ${pair}, interval ${interval}min. Time: ${docs[0].time}, value (close): ${docs[0].close}`);
                recordsProcessed++;
            } else {
                let newValue = new tradeDataModel({
                    pair: pair,
                    interval: interval,
                    time: time,
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                    vwap: vwap,
                    volume: volume,
                    count: count
                });
                newValue.save(err => {
                    if(err) {
                        log.err(err);
                    } else {
                        log.info(`saved new record: [pair: ${pair}, interval: ${interval}, time: ${Util.timeToDate(time)}, close:${close}]`)
                    }
                    recordsProcessed++;
                });
            }
        });
    });

};

setInterval(() => { 
    if(recordsProcessed === recordsToProcess) {
        process.exit(0);
    }
}, 500);