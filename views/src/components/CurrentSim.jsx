import React, { Component } from 'react';
import { numberWithCommas, formatTimeFull } from '../Util';
import { getEndingCrypto, getGoodBadTrades, runSimulation } from '../Analytics';
import { Table, Glyphicon, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

export default class CurrentSim extends Component {

	constructor() {
		super();
		this.state= {
			showTrades: false
		};
		this.handleShowTrades = this.handleShowTrades.bind(this);
	}

	handleShowTrades() {
		this.setState(prevState => {
			return { showTrades: !prevState.showTrades };
		});
	}

	overallResult() {
		let unit = this.props.pair.slice(1,4);
		let start = this.props.startingCrypto;
		let end = getEndingCrypto(this.props.signals, this.props.startingCrypto);
		let positive = end > start;
		let myClass = positive ? 'good' : 'bad';
		return <p>{unit}: <span className='startCrypto'>{start}</span> <Glyphicon className={myClass} glyph='arrow-right' /> <span className='endCrypto'>{end}</span></p>
	}

	getSignalsTableFormatted() {
			let simOutput = runSimulation(this.props.signals, 100);
			let output = [];
			simOutput.forEach((el) => {
				if(el.action) {
					output.push({
						time: formatTimeFull(el.time),
						action: el.action,
						price: numberWithCommas(Math.round(1000*el.price)/1000),
						cash: numberWithCommas(Math.round(100*el.cash)/100),
						crypto: numberWithCommas(Math.round(100*el.crypto)/100)
					})
				}
			});
			return output;
	}

	render() {
		return (
			<div className='currentSimSummary'>
				<h3 align='left'>Current Settings</h3>
				<Table striped condensed hover className='currentSimOutput'>
					<thead>
						<tr>
							<th align='center' className='avgTypeHeader'>Type</th>
							<th align='center' className='shortHeader'>Short</th>
							<th align='center' className='longHeader'>Long</th>
							<th align='center' className='startingHeader'>Starting {this.props.pair.slice(1,4)}</th>
							<th align='center' className='arrowHeader'></th>
							<th align='center' className='endingHeader'>Ending {this.props.pair.slice(1,4)}</th>
							<th align='center' className='goodTradesHeader'>Good trades</th>
							<th align='center' className='goodBuyTradesHeader'>Good Buy trades</th>
							<th align='center' className='goodSellTradesHeader'>Good Sell trades</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{this.props.avgType}</td>
							<td>{this.props.shortWindow}</td>
							<td>{this.props.longWindow}</td>
							<td>{this.props.startingCrypto}</td>
							<td><Glyphicon className={getEndingCrypto(this.props.signals, this.props.startingCrypto) > this.props.startingCrypto ? 'good' : 'bad'} glyph='arrow-right' /></td>
							<td>{getEndingCrypto(this.props.signals, this.props.startingCrypto)}</td>
							<td>{Math.round(getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodTrades / (getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodTrades + getGoodBadTrades(this.props.signals, this.props.startingCrypto).badTrades)*100)}% ({getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodTrades} / {getGoodBadTrades(this.props.signals, this.props.startingCrypto).badTrades})</td>
							<td>{Math.round(getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodBuys / (getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodBuys + getGoodBadTrades(this.props.signals, this.props.startingCrypto).badBuys)*100)}% ({getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodBuys} / {getGoodBadTrades(this.props.signals, this.props.startingCrypto).badBuys})</td>
							<td>{Math.round(getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodSells / (getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodSells + getGoodBadTrades(this.props.signals, this.props.startingCrypto).badSells)*100)}% ({getGoodBadTrades(this.props.signals, this.props.startingCrypto).goodSells} / {getGoodBadTrades(this.props.signals, this.props.startingCrypto).badSells})</td>
						</tr>
					</tbody>
				</Table>
				<Button onClick={this.handleShowTrades} bsStyle='primary'>{this.state.showTrades ? 'Hide Trades' : 'Show Trades'}</Button>
				<BootstrapTable className={this.state.showTrades ? '' : 'hidden'} data={ this.getSignalsTableFormatted() }>
					<TableHeaderColumn isKey={ true } dataField='time'>Time</TableHeaderColumn>
					<TableHeaderColumn dataField='action'>Action</TableHeaderColumn>
					<TableHeaderColumn dataField='price'>Price</TableHeaderColumn>
					<TableHeaderColumn dataField='cash'>{this.props.pair.slice(5,8)}</TableHeaderColumn>
					<TableHeaderColumn dataField='crypto'>{this.props.pair.slice(1,4)}</TableHeaderColumn>
				</BootstrapTable>
			</div>
		)
	}
}