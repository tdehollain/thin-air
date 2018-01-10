import React, { Component } from 'react';
import './App.css';
import ChartSettings from './components/ChartSettings.jsx';
import ChartContainer from './components/ChartContainer.jsx';
import SimulationContainer from './components/SimulationContainer.jsx';
import * as Analytics from './Analytics.js';

class App extends Component {
  constructor() {
    super();

    this.state = {
      pair: 'XXBTZEUR',
      interval: '60',
      priceType: 'close',
      avgType: 'EMA',
      shortWindow: 20,
      longWindow: 40,
      chartData: [],
      chartDataShortMA: [],
      chartDataLongMA: [],
      showAll: false,
      showShortMA: true,
      showLongMA: true,
      showScatter: false,
			signals: [{
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
  }
  
  fetchChartData(done) {
    fetch(`api/getChartData/${this.state.pair}/${this.state.interval}`)
      .then(res => res.json())
      .then(res => {
        let chartData = res.map(el => { return {
          time: el.time,
          open: el.open,
          high: el.high,
          low: el.low,
          close: el.close,
          vwap: el.vwap,
          volume: el.volume
        }});

        this.setState({ chartData: chartData }, done);
    });
  }

  updateMAs() {
    let dataArray = this.state.chartData.map(el => el[this.state.priceType]);

    let MA_short = Analytics.calcMA(this.state.avgType, dataArray, this.state.shortWindow);
    let MA_long = Analytics.calcMA(this.state.avgType, dataArray, this.state.longWindow);

    let shortArray = [];
    let longArray = [];
    this.state.chartData.forEach((el, i) => {
      shortArray.push({ time: el.time, short: MA_short[i] });
      longArray.push({ time: el.time, long: MA_long[i] });
    });

    this.setState({
      chartDataShortMA: shortArray,
      chartDataLongMA: longArray
    }, this.updateSimulation);
  }

  updateSimulation() {
    
    let priceArr = this.state.chartData.map(el => { return { time: el.time, price: el[this.state.priceType] } });
    let shortArr = this.state.chartDataShortMA.map(el => el.short);
    let longArr = this.state.chartDataLongMA.map(el => el.long);

    this.setState({ 
      signals: Analytics.getSignals(priceArr, shortArr, longArr, this.state.longWindow)
    }, () => { 
      this.setState({ showScatter: this.state.signals.length>0 })
    });
  }
  
  handleChangePair(e) {
    this.setState({ pair: e.target.value }, () => {
      this.fetchChartData(this.updateMAs);
    });
  }
  
  handleChangeInterval(e) {
    this.setState({ interval: e.target.value }, () => {
      this.fetchChartData(this.updateMAs);
    });
  }
  
  handleChangePriceType(e) {
    this.setState({ priceType: e.target.value }, this.updateMAs);
  }
  
  handleChangeAvgType(e) {
    this.setState({ avgType: e.target.value }, this.updateMAs);
  }
  
  handleChangeShortWindow(e) {
    let val = e.target.value;
    this.setState({ 
      shortWindow: val ? parseInt(val, 10) : '',
      showShortMA: val ? true : false
    }, this.updateMAs);
  }

  handleChangeLongWindow(e) {
    let val = e.target.value;
    this.setState({ 
      longWindow: val ? parseInt(val, 10) : '',
      showLongMA: val ? true : false
    }, this.updateMAs);
  }
  
  componentDidMount() {
    this.fetchChartData(this.updateMAs);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Out of thin air</h1>
        </header>
        <ChartSettings 
          pair={this.state.pair} 
          interval={this.state.interval} 
          priceType={this.state.priceType}
          handleChangePair={this.handleChangePair} 
          handleChangeInterval={this.handleChangeInterval} 
          handleChangePriceType={this.handleChangePriceType} 
          avgType={this.state.avgType}
          shortWindow={this.state.shortWindow}
          longWindow={this.state.longWindow}
					handleChangeAvgType={this.handleChangeAvgType}
					handleChangeShortWindow={this.handleChangeShortWindow}
          handleChangeLongWindow={this.handleChangeLongWindow}
        />
        <ChartContainer 
          pair={this.state.pair}
          interval={this.state.interval}
					priceType={this.state.priceType}
					showShortMA={this.state.showShortMA}
					showLongMA={this.state.showLongMA}
					showScatter={this.state.showScatter}
          chartData={this.state.chartData}
          chartDataShortMA={this.state.chartDataShortMA}
          chartDataLongMA={this.state.chartDataLongMA}
          signals={this.state.signals}
        />
        <SimulationContainer
          pair={this.state.pair}
          priceType={this.state.priceType}
          avgType={this.state.avgType}
          shortWindow={this.state.shortWindow}
          longWindow={this.state.longWindow}
          chartData={this.state.chartData.map(el => { return { time: el.time, price: el[this.state.priceType] } } )}
          signals={this.state.signals}
        />
      </div>
    );
  }
}

export default App;
