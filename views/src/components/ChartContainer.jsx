import React, { Component } from 'react';
import Chart from './Chart.jsx';

export default class ChartContainer extends Component {

	getBuyScatterData() {
		return this.props.simOutput.filter(el => el.action==='buy');
	}
	getSellScatterData() {
		return this.props.simOutput.filter(el => el.action==='sell');
	}

	render() {
		return (
			<div className='chartContainer'>
				<Chart 
					chartData={this.props.chartData}
					interval={this.props.interval}
					priceType={this.props.priceType}
					buyScatterData={this.getBuyScatterData()}
					sellScatterData={this.getSellScatterData()}
				/>
			</div>
		)
	}
}