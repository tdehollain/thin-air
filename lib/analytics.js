const tradeDataModel = require('./db.js').tradeDataModel;
const Util = require('./utils.js');
const log = require('./logger.js').log;

const pair = process.argv[2] || "XETHZEUR"; // e.g. XETHZEUR
const interval = process.argv[3] || "60"; // e.g. 1440 = daily
const method = process.argv[4] || "SMA";
const short = parseInt(process.argv[5], 10) || 5;
const long = parseInt(process.argv[6], 10) || 10;

log.info(`Trying for pair ${pair} & interval ${interval}min. ${method} with short=${short} and long=${long}`);

// Validating arguments
if(typeof pair !== 'string') throw new Error("Invalid pair");
if(!Util.isNumeric(interval)) throw new Error("Invalid interval");
if(!(method === "SMA" || method === "EMA")) throw new Error("method has to be SMA or EMA");

tradeDataModel.find({ pair: pair, interval: interval })
    // .limit(2)
    // .where('time').gt(Util.dateToTime(2015, 2, 1))
    // .where('time').equals(Util.dateToTime(2017, 2, 1))
    .sort('time')
    .select('close time')
    .exec((err, docs) => {
        if(err) throw new Error('Error getting data from DB: ' + err);

        let data = [];
        docs.map((el, i) => {
            data.push(el.close);
        });

        let MA_short = (method === "SMA") ? calcSMA(data, short) : calcEMA(data, short);
        let MA_long = (method === "SMA") ? calcSMA(data, long) : calcEMA(data, long);
        
        let i;
        let fullData = [];
        for(i=0; i<data.length; i++) {
            fullData.push([
                Util.timeToDate(docs[i].time), 
                data[i], 
                Math.round(MA_short[i]*100)/100, 
                Math.round(MA_long[i]*100)/100
            ]);
        }
        // fullData.map((el, index) => { log.debug(el); });
        log.info(runSimulation(fullData));

        process.exit(0);
});

const calcEMA = function(data, window) {
    let MA = [];
    let i;
    for(i=0; i<data.length; i++) {
        if(i<1) {
            MA.push(data[i]);
        } else {
            let K = 2/(window + 1);
            let EMA_prev = MA[MA.length-1];
            let EMA_current = (data[i] * K) + (EMA_prev * (1 - K));
            MA.push(EMA_current);
        }
    }
    return MA;
}

const calcSMA = function(data, window) {
    let MA = [];
    let i;
    for(i=0; i<data.length; i++) {
        if(i<window) {
            MA.push(0);
        } else {
            let workingArr = data.slice(i-window, i);
            let workingArrSum = workingArr.reduce((prev, curr) => curr += prev);
            let workingArrAvg = workingArrSum/workingArr.length;
            MA.push(workingArrAvg);
        }
    }
    return MA;
}

const runSimulation = function(fullData) {

    let output = [{
        time: 0,
        action: "start",
        price: 0,
        cryptocurrency: 100,
        cash: 100,
    }];

    let i;
    for(i=long+1; i<fullData.length; i++) {
        let time = fullData[i][0];
        let actual = fullData[i][1];
        let short = fullData[i][2];
        let long = fullData[i][3];
        let previousShort = fullData[i-1][2];
        let previousLong = fullData[i-1][3];
        
        let buySignal = short>long && previousShort<previousLong;
        let sellSignal = short<long && previousShort>previousLong;
        if(buySignal) {
            output.push({
                time,
                action: "buy",
                price: actual,
                short,
                long,
                cryptocurrency: output[output.length-1].cryptocurrency + output[output.length-1].cash / actual,
                cash: 0
            });
        } else if(sellSignal) {
            output.push({
                time,
                action: "sell",
                price: actual,
                short,
                long,
                cryptocurrency: 0,
                cash: output[output.length-1].cash + output[output.length-1].cryptocurrency * actual
            });
        } else {
            // output.push({
            //     time,
            //     action: "",
            //     price: actual,
            //     short,
            //     long,
            //     cryptocurrency: output[output.length-1].cryptocurrency,
            //     cash: output[output.length-1].cash
            // });
        }
    }

    return output;
}