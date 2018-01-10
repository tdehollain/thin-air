import React, { Component } from 'react';
import Chart from './Chart.jsx';

export default class ChartContainer extends Component {

	getBuyScatterData() {
		return this.props.signals.filter(el => el.action==='buy');
	}
	getSellScatterData() {
		return this.props.signals.filter(el => el.action==='sell');
	}

	render() {
		return (
			<div className='chartContainer'>
				<Chart 
					chartData={this.props.chartData}
          chartDataShortMA={this.props.chartDataShortMA}
          chartDataLongMA={this.props.chartDataLongMA}
          pair={this.props.pair}
					interval={this.props.interval}
					priceType={this.props.priceType}
					showShortMA={this.props.showShortMA}
					showLongMA={this.props.showLongMA}
					showScatter={this.props.showScatter}
					buyScatterData={this.getBuyScatterData()}
					sellScatterData={this.getSellScatterData()}
				/>
			</div>
		)
	}
}