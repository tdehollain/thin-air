const tradeDataModel = require('../lib/db.js').tradeDataModel;

module.exports = function(router) {
	router.get('/', (req, res) =>{
		res.sendFile(path.join(__dirname, 'views/build', 'index.html'));
	});

	router.get('/api/getChartData/:pair/:interval', (req, res) => {
		let pair = req.params.pair;
		let interval = req.params.interval;
		console.log(`GET chartData, pair=${pair}, interval=${interval}`);
		tradeDataModel.find({ pair: pair, interval: interval })
    // .limit(2)
    // .where('time').gt(Util.dateToTime(2015, 2, 1))
    // .where('time').equals(Util.dateToTime(2017, 2, 1))
    .sort('time')
    // .select('close time')
    .exec((err, docs) => {
			if(err) {
				throw new Error('Error getting data from DB: ' + err);
			} else {
				let data = [];
				docs.map((el, i) => {
					data.push({
						time: parseFloat(el.time),
						close: parseFloat(el.close),
						open: parseFloat(el.open),
						high: parseFloat(el.high),
						low: parseFloat(el.low),
						vwap: parseFloat(el.vwap),
						volume: parseFloat(el.volume)
					});
				});
				res.json(data);
			}
		});
	});

}