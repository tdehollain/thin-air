import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
// import { formatTimeFull, numberWithCommas } from '../Util';
import * as Analytics from '../Analytics.js';
import { BootstrapTable } from 'react-bootstrap-table';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';

export default class Simulation extends Component {

	constructor() {
		super();
		this.onRowClick=this.onRowClick.bind(this);
	}

	onRowClick(row) {
		this.props.handleRowClick(row);
	}

	getTableData() {
		let list = [];
		let i = this.props.shortFrom;
		let j = this.props.longFrom;

		for(i=this.props.shortFrom; i<=this.props.shortTo; i++) {
			for(j=this.props.longFrom; j<=this.props.longTo; j++) {
				if(j>i) {
					let dataArray = this.props.chartData.map(el => el.price);
					let MA_short = Analytics.calcMA(this.props.avgType, dataArray, i);
					let MA_long = Analytics.calcMA(this.props.avgType, dataArray, j);
			
					let shortArray = [];
					let longArray = [];
					this.props.chartData.forEach((el, index) => {
						// shortArray.push({ time: el.time, short: MA_short[index] });
						// longArray.push({ time: el.time, long: MA_long[index] });
						shortArray.push(MA_short[index]);
						longArray.push(MA_long[index]);
					});
					let signals = Analytics.getSignals(this.props.chartData, shortArray, longArray, j);
					let endingCrypto = Analytics.getEndingCrypto(signals, this.props.startingCrypto);
					let goodBadTrades = Analytics.getGoodBadTrades(signals, this.props.startingCrypto);

					let goodTradesPct = Math.round(goodBadTrades.goodTrades / (goodBadTrades.goodTrades + goodBadTrades.badTrades)*100);
					let goodBuysPct = Math.round(goodBadTrades.goodBuys / (goodBadTrades.goodBuys + goodBadTrades.badBuys)*100);
					let goodSellsPct = Math.round(goodBadTrades.goodSells / (goodBadTrades.goodSells + goodBadTrades.badSells)*100);

					list.push({
						avgType: this.props.avgType,
						short: i,
						long: j,
						startingCrypto: this.props.startingCrypto,
						arrow: endingCrypto > this.props.startingCrypto ? 'good' : 'bad',
						endingCrypto: endingCrypto,
						goodTrades: `${goodTradesPct}% (${goodBadTrades.goodTrades} / ${goodBadTrades.badTrades})`,
						goodBuys: `${goodBuysPct}% (${goodBadTrades.goodBuys} / ${goodBadTrades.badBuys})`,
						goodSells: `${goodSellsPct}% (${goodBadTrades.goodSells} / ${goodBadTrades.badSells})`
					});
				}
			}
		}
		return list;
	}

	render() {

		if(this.props.chartData.length === 0) return null;

		function strategyArrow(cell, row) {
			return (<Glyphicon className={ cell } glyph='arrow-right' />);
		}

		return (
			<BootstrapTable data={ this.getTableData()} hover condensed options={{ onRowClick: this.onRowClick }}>
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
		)		
	}
}