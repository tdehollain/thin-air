import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class SimulationSettings extends Component {

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
			<Form inline>
				<FormGroup controlId="formAvgType">
					<ControlLabel>Average Type</ControlLabel>
					<FormControl componentClass='select' name='avgType' onChange={this.props.handleChangeAvgType} value={this.props.avgType}>
						<option value='SMA'>SMA</option>
						<option value='EMA'>EMA</option>
					</FormControl>
				</FormGroup>
				<FormGroup controlId="formShortWindow">
					<ControlLabel>Short Window</ControlLabel>
					<FormControl componentClass='select' name='shortWindow' onChange={this.props.handleChangeShortWindow} value={this.props.shortWindow}>
						{this.listOptions()}
					</FormControl>
				</FormGroup>
				<FormGroup controlId="formLongWindow">
					<ControlLabel>Long Window</ControlLabel>
					<FormControl componentClass='select' name='longWindow' onChange={this.props.handleChangeLongWindow} value={this.props.longWindow}>
						{this.listOptions()}
					</FormControl>
				</FormGroup>
				<Button bsStyle='primary' onClick={this.props.handleSubmit}>Go</Button>
			</Form>
		)
	}
}