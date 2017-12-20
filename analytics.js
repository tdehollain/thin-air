const tradeDataModel = require('./lib/db.js').tradeDataModel;
const Util = require('./lib/utils.js');

const pair = process.argv[2]; // e.g. ETHZUSD
const interval = process.argv[3]; // e.g. 1440 = daily
let short = 5;
let long = 10;


tradeDataModel.find({ pair: pair, interval: interval})
    // .limit(2)
    // .where('time').gt(Util.dateToTime(2015, 2, 1))
    // .where('time').equals(Util.dateToTime(2017, 2, 1))
    .sort('time')
    .select('close time')
    .exec((err, docs) => {
        let data = [];
        console.log(docs[0]);
        docs.map((el, i) => {
            data.push(el.close);
        });
        let MA_short = calcMA(data, short);
        let MA_long = calcMA(data, long);

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
        // console.log(MA_short.slice(MA_short.length-20));
        // console.log(MA_long.slice(MA_long.length-20));
        console.log(runSimulation(fullData));

        process.exit(0);
});

const calcMA = function(data, window) {
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