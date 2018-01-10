import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class ChartSettings extends Component {
	
	listOptions() {
		let res = [];
		for(let i=0; i<100; i++) {
			res.push(
				<option key={i} value={i+1}>{i+1}</option>
			)
		}
		return res;
	}

	render() {
		return (
			<div className='chartSettingsContainer'>
				<div className='chartSettingsHeader'>
					<h3>Chart Settings</h3>
				</div>
				<Form className='chartSettingsForm'>
					<FormGroup controlId="formPair">
						<ControlLabel>Trading pair</ControlLabel>
						<FormControl componentClass='select' name='pair' onChange={this.props.handleChangePair} value={this.props.pair}>
							<option value='XXBTZEUR'>XBT-EUR</option>
							<option value='XETHZEUR'>ETH-EUR</option>
							<option value='XETHXXBT'>ETH-XBT</option>
							<option value='XLTCZEUR'>LTC-EUR</option>
							<option value='XLTCXXBT'>LTC-XBT</option>
						</FormControl>
					</FormGroup>
					<FormGroup controlId="formInterval">
						<ControlLabel>Interval</ControlLabel>
						<FormControl componentClass='select' name='interval' onChange={this.props.handleChangeInterval} value={this.props.interval}>
							<option value='15'>15</option>
							<option value='60'>60</option>
							<option value='240'>240</option>
							<option value='1440'>1440</option>
						</FormControl>
					</FormGroup>
					<FormGroup controlId="formPriceType">
						<ControlLabel>Price type</ControlLabel>
						<FormControl componentClass='select' name='priceType' onChange={this.props.handleChangePriceType} value={this.props.priceType}>
							<option value='open'>open</option>
							<option value='high'>high</option>
							<option value='low'>low</option>
							<option value='close'>close</option>
							<option value='vwap'>vwap</option>
						</FormControl>
					</FormGroup>
					<FormGroup controlId="formAvgType">
						<ControlLabel>Average Type</ControlLabel>
						<FormControl componentClass='select' name='avgType' onChange={this.props.handleChangeAvgType} value={this.props.avgType}>
							<option value='EMA'>EMA</option>
							<option value='SMA'>SMA</option>
						</FormControl>
					</FormGroup>
					<FormGroup controlId="formShortWindow">
						<ControlLabel>Short Window</ControlLabel>
						<FormControl type='text' onChange={this.props.handleChangeShortWindow} value={this.props.shortWindow} />
					</FormGroup>
					<FormGroup controlId="formLongWindow">
						<ControlLabel>Long Window</ControlLabel>
						<FormControl type='text' onChange={this.props.handleChangeLongWindow} value={this.props.longWindow} />
					</FormGroup>
				</Form>
			</div>
		)
	}
}