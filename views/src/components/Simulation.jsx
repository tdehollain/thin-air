import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
// import { formatTimeFull, numberWithCommas } from '../Util';
import * as Analytics from '../Analytics.js';
import { BootstrapTable } from 'react-bootstrap-table';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import HeatMap from 'react-heatmap-grid';

export default class Simulation extends Component {

	constructor() {
		super();
		this.onRowClick=this.onRowClick.bind(this);
	}

	onRowClick(row) {
		this.props.handleRowClick(row);
	}

	getHeatMapX() {
		let output = [];
		let i;
		for(i=this.props.longFrom; i<=this.props.longTo; i++) {
			output.push('l-' + i);
		}
		return output;
	}

	getHeatMapY() {
		let output = [];
		let i;
		for(i=this.props.shortFrom; i<=this.props.shortTo; i++) {
			output.push('s-' + i);
		}
		return output;
	}

	getHeatMapData() {
		let list = Analytics.getSimulationResults(this.props.avgType, this.props.chartData, this.props.shortFrom, this.props.shortTo, this.props.longFrom, this.props.longTo, this.props.startingCrypto);
		let nbShorts = this.props.shortTo - this.props.shortFrom + 1; // 11
		let nbLongs = this.props.longTo - this.props.longFrom + 1; // 6

		let output = [];
		let i;
		for(i=0; i<nbShorts; i++) {
			output[i]=[]
		}

		let j;
		for(i=0; i<nbShorts; i++) {
			for(j=0; j<nbLongs; j++) {
				let temp = list.filter(el => el.short - this.props.shortFrom === i && el.long - this.props.longFrom === j);
				if(temp.length) {
					output[i][j] = temp[0].endingCrypto;
				} else {
					output[i][j] = this.props.startingCrypto;
				}
			}
		}
		
		// list.forEach(el => {
		// 	let x = el.short - this.props.shortFrom;
		// 	let y = el.long - this.props.longFrom;
		// 	console.log(output);
		// 	output[el.short - this.props.shortFrom][el.long - this.props.longFrom] = el.endingCrypto ? el.endingCrypto : 0;
		// });

		return output;
	}

	render() {

		if(this.props.chartData.length === 0) return null;

		function strategyArrow(cell, row) {
			return (<Glyphicon className={ cell } glyph='arrow-right' />);
		}

		return (
			<div>
				<div className='heatmap'>
					<HeatMap
						xLabels={this.getHeatMapX()}
						yLabels={this.getHeatMapY()}
						data={this.getHeatMapData()}
					/>
				</div>
				<BootstrapTable data={ Analytics.getSimulationResults(this.props.avgType, this.props.chartData, this.props.shortFrom, this.props.shortTo, this.props.longFrom, this.props.longTo, this.props.startingCrypto)} hover condensed options={{ onRowClick: this.onRowClick }}>
					<TableHeaderColumn isKey={ true } dataField='avgType' dataAlign={'center'} dataSort={ true } width='60'>Type</TableHeaderColumn>
					<TableHeaderColumn dataField='short' dataAlign={'center'} dataSort={ true } width='60'>Short</TableHeaderColumn>
					<TableHeaderColumn dataField='long' dataAlign={'center'} dataSort={ true } width='60'>Long</TableHeaderColumn>
					<TableHeaderColumn dataField='startingCrypto' dataAlign={'center'} dataSort={ true } width='100'>Starting {this.props.pair.slice(1,4)}</TableHeaderColumn>
					<TableHeaderColumn dataField='arrow' width='50' dataFormat={strategyArrow}></TableHeaderColumn>
					<TableHeaderColumn dataField='endingCrypto' dataAlign={'center'} dataSort={ true } width='100'>Ending {this.props.pair.slice(1,4)}</TableHeaderColumn>
					<TableHeaderColumn dataField='goodTrades' dataAlign={'center'} dataSort={ true } width='110'>Good Trades</TableHeaderColumn>
					<TableHeaderColumn dataField='goodBuys' dataAlign={'center'} dataSort={ true } width='110'>Good Buys</TableHeaderColumn>
					<TableHeaderColumn dataField='goodSells' dataAlign={'center'} dataSort={ true } width='110'>Good Sells</TableHeaderColumn>
				</BootstrapTable>
			</div>
		)		
	}
}