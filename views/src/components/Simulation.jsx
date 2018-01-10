import React, { Component } from 'react';
import { Table, Glyphicon } from 'react-bootstrap';
import { formatTimeFull, numberWithCommas } from '../Util';
import * as Analytics from '../Analytics.js';

export default class Simulation extends Component {

	render() {

		if(this.props.chartData.length === 0) return null;

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

					list.push(
						<tr key={`short-${i}_long-${j}`}>
							<td>{this.props.avgType}</td>
							<td>{i}</td>
							<td>{j}</td>
							<td>{this.props.startingCrypto}</td>
							<td><Glyphicon className={endingCrypto > this.props.startingCrypto ? 'good' : 'bad'} glyph='arrow-right' /></td>
							<td>{endingCrypto}</td>
							<td>{Math.round(goodBadTrades.goodTrades / (goodBadTrades.goodTrades + goodBadTrades.badTrades)*100)}% ({goodBadTrades.goodTrades} / {goodBadTrades.badTrades})</td>
							<td>{Math.round(goodBadTrades.goodBuys / (goodBadTrades.goodBuys + goodBadTrades.badBuys)*100)}% ({goodBadTrades.goodBuys} / {goodBadTrades.badBuys})</td>
							<td>{Math.round(goodBadTrades.goodSells / (goodBadTrades.goodSells + goodBadTrades.badSells)*100)}% ({goodBadTrades.goodSells} / {goodBadTrades.badSells})</td>
						</tr>
					)
				}
			}
		}

		return (
			<Table striped bordered condensed hover className='simulationOutput'>
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
					{list}
				</tbody>
			</Table>
		)		
	}
}