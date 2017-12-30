import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

export default class Settings extends Component {
	render() {
		return (
			<Form inline>
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
			</Form>
		)
	}
}