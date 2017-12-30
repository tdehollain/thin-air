import React, { Component } from 'react';
import { VictoryChart, VictoryZoomContainer, VictoryLine, VictoryScatter, VictoryAxis, VictoryTheme } from 'victory';
import { formatTime, numberWithCommas } from '../Util';

export default class Chart extends Component {

	render() {
		return (
			<VictoryChart
				theme={VictoryTheme.material}
				domainPadding={5}
				width={1000}
				containerComponent={
					<VictoryZoomContainer />
				}
			>
				<VictoryAxis
					tickFormat={formatTime}
					style={{
						ticks: {stroke: "grey", size: 5},
						tickLabels: {fontSize: 10, padding: 15}
					}}
				/>
				<VictoryAxis
					dependentAxis
					tickFormat={(x) => { return `${numberWithCommas(x)} €`; }}
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
				<VictoryLine 
					data={this.props.chartData}
					x='time'
					y='short'
					style={{
						data: {
							stroke: '#c62929',
							strokeWidth: 0.7
						}
					}}
				/>
				<VictoryLine 
					data={this.props.chartData}
					x='time'
					y='long'
					style={{
						data: {
							stroke: '#c62929',
							strokeWidth: 0.7
						}
					}}
				/>
				<VictoryScatter
					style={{ data: { fill: "#84e288", stroke: "#333", strokeWidth: 1 } }}
					size={4}
					symbol='triangleUp'
					data={this.props.buyScatterData}
					x='time'
					y='price'
				/>
				<VictoryScatter
					style={{ data: { fill: "#f58a4d", stroke: "#333", strokeWidth: 1 } }}
					size={4}
					symbol='triangleDown'
					data={this.props.sellScatterData}
					x='time'
					y='price'
				/>
			</VictoryChart>
		)
	}
}