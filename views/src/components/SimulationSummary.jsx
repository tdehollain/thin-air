import React, { Component } from 'react';
import { numberWithCommas } from '../Util';

export default class SimulationSummary extends Component {
	
	getStartingCrypto() {
		return numberWithCommas(this.props.simOutput[0].cryptocurrency);
	}

	getEndingCrypto() {
		let output = this.props.simOutput;
		let lastEntry = output[output.length - 1];
		let res = lastEntry.cryptocurrency === 0 ? lastEntry.cash / lastEntry.price : lastEntry.cryptocurrency;
		// return numberWithCommas(res);
		return Math.round(res*100)/100;
	}
	
	getStartingCash() {
		return numberWithCommas(this.props.simOutput[0].cash);
	}

	getEndingCash() {
		let output = this.props.simOutput;
		let lastEntry = output[output.length - 1];
		let res = lastEntry.cash === 0 ? lastEntry.cryptocurrency * lastEntry.price : lastEntry.cash;
		return numberWithCommas(Math.round(res));
	}

	getGoodBadTrades() {
		let output = this.props.simOutput;
		let goodBuys = 0;
		let badBuys = 0;
		let goodSells = 0;
		let badSells = 0;
		let i;
		for(i=2; i<output.length; i++) {
			if(output[i].action === 'buy') {
				if(output[i].price < output[i-1].price) {
					goodBuys++;
				} else {
					badBuys++;
				}
			} else {
				if(output[i].price > output[i-1].price) {
					goodSells++;
				} else {
					badSells++;
				}
			}
		}
		let goodTrades = goodBuys + goodSells;
		let badTrades = badBuys + badSells;

		return { goodBuys, badBuys, goodSells, badSells, goodTrades, badTrades };
	}

	render() {
		return (
			<div className='simulationSummary'>
				<h2 align='left'>Summary</h2>
				<p>Started with (crypto): {this.getStartingCrypto()}</p>
				<p>Ended with (crypto): {this.getEndingCrypto()}</p>
				<p>Started with (cash): {this.getStartingCash()}</p>
				<p>Ended with (cash): {this.getEndingCash()}</p>
				<p>Good trades: {this.getGoodBadTrades().goodTrades}</p>
				<p>Bad trades: {this.getGoodBadTrades().badTrades}</p>
				<p>Good trades ratio: {Math.round(this.getGoodBadTrades().goodTrades / (this.getGoodBadTrades().goodTrades + this.getGoodBadTrades().badTrades)*100)}%</p>
				<p>Good buy trades: {this.getGoodBadTrades().goodBuys}</p>
				<p>Bad buy trades: {this.getGoodBadTrades().badBuys}</p>
				<p>Good buy trades ratio: {Math.round(this.getGoodBadTrades().goodBuys / (this.getGoodBadTrades().goodBuys + this.getGoodBadTrades().badBuys)*100)}%</p>
				<p>Good sell trades: {this.getGoodBadTrades().goodSells}</p>
				<p>Bad sell trades: {this.getGoodBadTrades().badSells}</p>
				<p>Good sell trades ratio: {Math.round(this.getGoodBadTrades().goodSells / (this.getGoodBadTrades().goodSells + this.getGoodBadTrades().badSells)*100)}%</p>
			</div>
		)
	}
}