import React, { Component } from 'react';
import './App.css';
import Settings from './components/Settings.jsx';
import ChartContainer from './components/ChartContainer.jsx';
import SimulationContainer from './components/SimulationContainer.jsx';

class App extends Component {
  constructor() {
    super();

    this.state = {
      pair: 'XXBTZEUR',
      interval: '15',
      priceType: 'close',
      avgType: 'EMA',
      shortWindow: 20,
      longWindow: 40,
      chartData: [],
			showAll: false,
			simOutput: [{
				time: 0,
				action: '',
				price: 0,
				short: 0,
				long: 0,
				cryptocurrency: 0,
				cash: 0
			}]
    }

    this.handleChangePair=this.handleChangePair.bind(this);
    this.handleChangeInterval=this.handleChangeInterval.bind(this);
    this.handleChangePriceType=this.handleChangePriceType.bind(this);
    this.handleChangeAvgType=this.handleChangeAvgType.bind(this);
    this.handleChangeShortWindow=this.handleChangeShortWindow.bind(this);
    this.handleChangeLongWindow=this.handleChangeLongWindow.bind(this);
		this.runSimulation=this.runSimulation.bind(this);
  }
  
  fetchChartData(done) {
    fetch(`api/getChartData/${this.state.pair}/${this.state.interval}`)
      .then(res => res.json())
      .then(res => { 
        // calculate MA
        let valuesArr = [];
        res.map((el, i) => { valuesArr.push(el[this.state.priceType]) });
        let short = this.calcEMA(valuesArr, this.state.shortWindow);
        let long = this.calcEMA(valuesArr, this.state.longWindow);

        let chartData = [];
        res.map((el, i) => {
          let dataPoint = {
            time: el.time,
            open: el.open,
            high: el.high,
            low: el.low,
            close: el.close,
            vwap: el.vwap,
            volume: el.volume,
            short: short[i],
            long: long[i]
          }
          chartData.push(dataPoint);
        });

        this.setState({ chartData: chartData }, done);
    });
  }
	
	calcEMA(data, window) {
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

	calcSMA(data, window) {
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
  
  runSimulation() {
    let output = [{
      time: 0,
      action: "start",
      price: 0,
      cryptocurrency: 100,
      cash: 0,
    }];

    let fullData = this.state.chartData;
    // let short = this.state.shortWindow;
    let long = this.state.longWindow;
    let i;
    for(i=long+1; i<fullData.length; i++) {
      let time = fullData[i].time;
      let actual = fullData[i][this.state.priceType];
      let short = fullData[i].short;
      let long = fullData[i].long;
      let previousShort = fullData[i-1].short;
      let previousLong = fullData[i-1].long;
      
      let buySignal = short>long && previousShort<previousLong;
      let sellSignal = short<long && previousShort>previousLong;
      if(output.length>1 && buySignal) {
        output.push({
          time,
          action: "buy",
          price: actual,
          short,
          long,
          cryptocurrency: Math.round(output[output.length-1].cryptocurrency + output[output.length-1].cash / actual * 100) / 100,
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
          cash: Math.round(output[output.length-1].cash + output[output.length-1].cryptocurrency * actual)
        });
      } else {
        this.state.showAll && output.push({
          time,
          action: "",
          price: actual,
          short,
          long,
          cryptocurrency: output[output.length-1].cryptocurrency,
          cash: output[output.length-1].cash
        });
      }
    }
    this.setState({ simOutput: output });
  }
  
  handleChangePair(e) {
    this.setState({ pair: e.target.value }, this.fetchChartData);
  }
  
  handleChangeInterval(e) {
    this.setState({ interval: e.target.value }, this.fetchChartData);
  }
  
  handleChangePriceType(e) {
    this.setState({ priceType: e.target.value }, this.fetchChartData);
  }
  
  handleChangeAvgType(e) {
    this.setState({ avgType: e.target.value }, this.fetchChartData);
  }
  
  handleChangeShortWindow(e) {
    this.setState({ shortWindow: parseInt(e.target.value, 10) }, this.fetchChartData);
  }

  handleChangeLongWindow(e) {
    this.setState({ longWindow: parseInt(e.target.value, 10) }, this.fetchChartData);
  }
  
  componentDidMount() {
    this.fetchChartData();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Out of thin air</h1>
        </header>
        <Settings 
          pair={this.state.pair} 
          interval={this.state.interval} 
          priceType={this.state.priceType}
          handleChangePair={this.handleChangePair} 
          handleChangeInterval={this.handleChangeInterval} 
          handleChangePriceType={this.handleChangePriceType} 
        />
        <ChartContainer 
          pair={this.state.pair}
          interval={this.state.interval}
					priceType={this.state.priceType}
          chartData={this.state.chartData}
          simOutput={this.state.simOutput}
        />
        <SimulationContainer
          priceType={this.state.priceType}
          avgType={this.state.avgType}
          shortWindow={this.state.shortWindow}
          longWindow={this.state.longWindow}
					handleChangeAvgType={this.handleChangeAvgType}
					handleChangeShortWindow={this.handleChangeShortWindow}
          handleChangeLongWindow={this.handleChangeLongWindow}
          handleSubmit={this.runSimulation}
          simOutput={this.state.simOutput}
        />
      </div>
    );
  }
}

export default App;
