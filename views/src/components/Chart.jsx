import React, { Component } from 'react';
import { VictoryChart, VictoryZoomContainer, VictoryBrushContainer, VictoryLine, VictoryScatter, VictoryAxis, VictoryTheme } from 'victory';
import { formatTime, numberWithCommas } from '../Util';

export default class Chart extends Component {

	constructor() {
		super();

		this.state = {};
	}
	
	handleZoom(domain) {
		this.setState({selectedDomain: domain});
	}

	handleBrush(domain) {
		this.setState({zoomDomain: domain});
	}

	render() {

		let unit = this.props.pair.slice(4)==='XXBT' ? 'BTC' : '€'; 

		// let xMin = 0;
		// let xMax = 1;
		// let yMin = 0;
		// let yMax = 1;

		// if (this.props.chartData.length > 0) {
		// 	xMin = this.props.chartData[0].time;
		// 	yMax = this.props.chartData[0][this.props.priceType];
		// 	this.props.chartData.forEach(el => {
		// 		if(el.time > xMax) xMax = el.time;
		// 		if(el[this.props.priceType] > yMax) yMax = el[this.props.priceType];
		// 	});
		// }

		let shortMA;
		let longMA;
		let buyScatter;
		let sellScatter;

		if(this.props.showShortMA) {
			shortMA = 
				<VictoryLine 
					data={this.props.chartDataShortMA}
					x='time'
					y='short'
					style={{
						data: {
							stroke: '#c62929',
							strokeWidth: 0.7
						}
					}}
				/>;
		} else {

		}
		if(this.props.showLongMA) {
			longMA = 
				<VictoryLine 
					data={this.props.chartDataLongMA}
					x='time'
					y='long'
					style={{
						data: {
							stroke: '#c62929',
							strokeWidth: 0.7
						}
					}}
				/>;
		} else { 
			
		}

		if(this.props.buyScatterData.length) {
			buyScatter = 
				<VictoryScatter
					style={{ data: { fill: "#84e288", stroke: "#333", strokeWidth: 1 } }}
					size={4}
					symbol='triangleUp'
					data={this.props.buyScatterData}
					x='time'
					y='price'
				/>;
		}
		if(this.props.sellScatterData.length) {
			sellScatter = 
				<VictoryScatter
					style={{ data: { fill: "#f58a4d", stroke: "#333", strokeWidth: 1 } }}
					size={4}
					symbol='triangleDown'
					data={this.props.sellScatterData}
					x='time'
					y='price'
				/>;
		}

		return (
			<div>
				<VictoryChart
					theme={VictoryTheme.material}
					// domain={{ x:[xMin, xMax], y:[yMin, yMax] }}
					domainPadding={5}
					padding={{ left: 70, right: 50, top: 50, bottom: 50 }}
					width={1200}
					height={500}
					containerComponent={
						<VictoryZoomContainer 
							responsive={false}
							zoomDomain={this.state.zoomDomain}
							// onZoomDomainChange={this.handleZoom.bind(this)}
						/>
					}
				>
					<VictoryBrushContainer
						responsive={false}
						brushDimension="x"
						brushDomain={this.state.selectedDomain}
						onBrushDomainChange={this.handleBrush.bind(this)}
					/>
					<VictoryAxis
						tickFormat={formatTime}
						style={{
							ticks: {stroke: "grey", size: 5},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/>
					<VictoryAxis
						dependentAxis
						tickFormat={(x) => { return `${numberWithCommas(x)} ${unit}`; }}
						style={{
							ticks: {stroke: "grey", size: 5},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/>
					<VictoryLine 
						data={this.props.chartData}
						x='time'
						y={this.props.priceType}
						style={{
							data: {
								stroke: '#92b8f7',
								strokeWidth: 1.5
							}
						}}
					/>
					{shortMA}
					{longMA}
					{buyScatter}
					{sellScatter}
				</VictoryChart>
				<VictoryChart
					width={1200} height={110} scale={{x: "time"}}
					padding={{ left: 70, right: 50, top: 0, bottom: 30 }}
					domainPadding={5}
					containerComponent={
						<VictoryBrushContainer responsive={false}
							brushDimension="x"
							brushDomain={this.state.selectedDomain}
							onBrushDomainChange={this.handleBrush.bind(this)}
						/>
					}
				>
					<VictoryAxis
						tickFormat={formatTime}
						style={{
							ticks: {stroke: "grey", size: 5},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/>
					<VictoryLine 
						data={this.props.chartData}
						x='time'
						y={this.props.priceType}
						style={{
							data: {
								stroke: '#92b8f7',
								strokeWidth: 1.5
							}
						}}
					/>
				</VictoryChart>
			</div>
		)
	}
}