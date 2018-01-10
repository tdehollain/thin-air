export function calcMA(type, data, window) {
		if(type==='SMA') {
			return calcSMA(data, window);
		} else {
			return calcEMA(data, window)
		}
}

export function calcEMA(data, window) {
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

export function calcSMA(data, window) {
	let MA = [];
	let i;
	for(i=0; i<data.length; i++) {
			if(i<window) {
					MA.push(null);
			} else {
					let workingArr = data.slice(i-window, i);
					let workingArrSum = workingArr.reduce((prev, curr) => curr += prev);
					let workingArrAvg = workingArrSum/workingArr.length;
					MA.push(workingArrAvg);
			}
	}
	console.log(MA);
	return MA;
}

export function getSignals(chartData, shortArr, longArr, longWindow) {
	if(chartData.length===0) return;
	let output = [
		{
			time: chartData[0].time,
			action: "start",
			price: 0
		}
	];

	let i;

	for(i=longWindow+1; i<chartData.length; i++) {
		let time = chartData[i].time;
		let actual = chartData[i].price;
		let short = shortArr[i];
		let long = longArr[i];
		let previousShort = shortArr[i-1];
		let previousLong = longArr[i-1];
		
		let buySignal = short>long && previousShort<previousLong;
		let sellSignal = short<long && previousShort>previousLong;
		if(buySignal) {
			output.push({
				time,
				action: "buy",
				price: actual
			});
		} else if(sellSignal) {
			output.push({
				time,
				action: "sell",
				price: actual
			});
		} else {
			output.push({
				time,
				action: "",
				price: actual
			});
		}
	}
	return output;
}

export function runSimulation(signals, startingCrypto) {
	if(!signals || signals.length===0) return;
	let simArr = [{
		time: signals[0].time,
		action: signals[0].action,
		price: signals[0].price,
		cash: 0,
		crypto: startingCrypto
	}];

	signals.forEach(el => {
		let lastEntry = simArr[simArr.length-1];
		if(el.action==='buy' && lastEntry.cash) {
			simArr.push({
				time: el.time,
				action: el.action,
				price: el.price,
				cash: 0,
				crypto: lastEntry.cash / el.price
			});
		} else if(el.action==='sell' && lastEntry.crypto){
			simArr.push({
				time: el.time,
				action: el.action,
				price: el.price,
				cash: lastEntry.crypto * el.price,
				crypto: 0
			});
		}
	});
	return simArr;
}

export function getEndingCrypto(signals, startingCrypto) {
	if(!signals || signals.length===0) return;
	let simOutput = runSimulation(signals, startingCrypto);
	let lastSimEntry = simOutput[simOutput.length-1];
	return Math.round((lastSimEntry.crypto || lastSimEntry.cash / lastSimEntry.price)*100)/100;
}

export function	getGoodBadTrades(signals, startingCrypto) {
	if(!signals || signals.length===0) return;
		let output = runSimulation(signals, startingCrypto);
		let goodBuys = 0;
		let badBuys = 0;
		let goodSells = 0;
		let badSells = 0;
		let i;
		for(i=2; i<output.length; i++) {
			if(output[i].action === 'buy') {
				if(output[i].price < output[i-1].price) {
					goodBuys++;
				} else {
					badBuys++;
				}
			} else if(output[i].action === 'sell') {
				if(output[i].price > output[i-1].price) {
					goodSells++;
				} else {
					badSells++;
				}
			}
		}
		let goodTrades = goodBuys + goodSells;
		let badTrades = badBuys + badSells;

		return { goodBuys, badBuys, goodSells, badSells, goodTrades, badTrades };
	}