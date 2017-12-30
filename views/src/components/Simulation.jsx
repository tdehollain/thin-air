import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { formatTimeFull, numberWithCommas } from '../Util';

export default class Simulation extends Component {

	render() {
		let list = this.props.simOutput.map((el, i) => {
			// console.log(el);
				let className = '';
				if(i>0) {
					let goodTrade;
					if(el.action === 'buy') {
						goodTrade = el.price < this.props.simOutput[i-1].price;
					} else {
						goodTrade = el.price > this.props.simOutput[i-1].price;
					}
					className = goodTrade ? 'good' : 'bad';
				}
				return (
					<tr className={className} key={i}>
						<td>{i}</td>
						<td>{formatTimeFull(el.time)}</td>
						<td>{el.action}</td>
						<td>{numberWithCommas(el.price)}</td>
						<td>{numberWithCommas(el.cryptocurrency)}</td>
						<td>{numberWithCommas(el.cash)}</td>
					</tr>
				)
			});

		return (
			<Table striped bordered condensed hover className='simulationOutput'>
				<thead>
					<tr>
						<th align='center' className='IDHeader'>#</th>
						<th align='center' className='timeHeader'>Time</th>
						<th align='center' className='actionHeader'>Action</th>
						<th align='center' className='priceHeader'>Price</th>
						<th align='center' className='cryptoHeader'>Cryptocurrency</th>
						<th align='center' className='cashHeader'>Cash</th>
					</tr>
				</thead>
				<tbody>
					{list}
				</tbody>
			</Table>
		)		
	}
}