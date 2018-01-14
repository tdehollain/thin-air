import React, { Component } from 'react';
import './App.css';
import ChartSettings from './components/ChartSettings.jsx';
import ChartContainer from './components/ChartContainer.jsx';
import SimulationContainer from './components/SimulationContainer.jsx';
import * as Analytics from './Analytics.js';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      pair: localStorage.getItem('pair') || 'XXBTZEUR',
      interval: localStorage.getItem('interval') || '60',
      priceType: localStorage.getItem('priceType') || 'close',
      avgType: localStorage.getItem('avgType') || 'EMA',
      shortWindow: parseInt(localStorage.getItem('shortWindow'), 10) || 20,
      longWindow: parseInt(localStorage.getItem('longWindow'), 10) || 40,
      submitDisabled: true,
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
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleRowClick=this.handleRowClick.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    this.fetchChartData(this.updateMAs);
    this.setState({ submitDisabled: true });
  }
  
  handleChangePair(e) {
    localStorage.setItem('pair', e.target.value);
    this.setState({ pair: e.target.value, submitDisabled: false });
  }
  
  handleChangeInterval(e) {
    localStorage.setItem('interval', e.target.value);
    this.setState({ interval: e.target.value, submitDisabled: false });
  }
  
  handleChangePriceType(e) {
    localStorage.setItem('priceType', e.target.value);
    this.setState({ priceType: e.target.value, submitDisabled: false });
  }
  
  handleChangeAvgType(e) {
    localStorage.setItem('pairž', e.target.value);
    this.setState({ avgType: e.target.value, submitDisabled: false });
  }
  
  handleChangeShortWindow(e) {
    localStorage.setItem('shortWindow', e.target.value);
    let val = e.target.value;
    this.setState({ 
      shortWindow: val ? parseInt(val, 10) : '',
      showShortMA: val ? true : false,
      submitDisabled: false
    });
  }

  handleChangeLongWindow(e) {
    localStorage.setItem('longWindow', e.target.value);
    let val = e.target.value;
    this.setState({ 
      longWindow: val ? parseInt(val, 10) : '',
      showLongMA: val ? true : false,
      submitDisabled: false
    });
  }

  handleRowClick(row) {
    localStorage.setItem('avgType', row.avgType);
    localStorage.setItem('shortWindow', row.shortWindow);
    localStorage.setItem('longWindow', row.longWindow);
    this.setState({
      avgType: row.avgType,
      shortWindow: row.short,
      longWindow: row.long
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
          handleSubmit={this.handleSubmit}
          submitDisabled={this.state.submitDisabled}
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
          handleRowClick={this.handleRowClick}
        />
      </div>
    );
  }
}

export default App;
