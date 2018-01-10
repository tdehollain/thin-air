import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class SimulationSettings extends Component {
	render() {
		return (
			<div className='simSettingsContainer'>
				<h3>Simulation</h3>
				<Form>
					<FormGroup controlId="formAvgType">
						<ControlLabel>Average Type</ControlLabel>
						<FormControl componentClass='select' name='avgType' onChange={this.props.handleChangeAvgType} value={this.props.avgType}>
							<option value='EMA'>EMA</option>
							<option value='SMA'>SMA</option>
						</FormControl>
					</FormGroup>
					<FormGroup controlId="formShortFromWindow">
						<ControlLabel>Short: From</ControlLabel>
						<FormControl type='text' name='shortFrom' onChange={this.props.handleChangeShortFrom} value={this.props.shortFrom}></FormControl>
					</FormGroup>
					<FormGroup controlId="formShortToWindow">
						<ControlLabel>Short: To</ControlLabel>
						<FormControl type='text' name='shortTo' onChange={this.props.handleChangeShortTo} value={this.props.shortTo}>
						</FormControl>
					</FormGroup>
					<FormGroup controlId="formLongFromWindow">
						<ControlLabel>Long: From</ControlLabel>
						<FormControl type='text' name='longFrom' onChange={this.props.handleChangeLongFrom} value={this.props.longFrom}></FormControl>
					</FormGroup>
					<FormGroup controlId="formLongToWindow">
						<ControlLabel>Long: To</ControlLabel>
						<FormControl type='text' name='longTo' onChange={this.props.handleChangeLongTo} value={this.props.longTo}>
						</FormControl>
					</FormGroup>
					<Button bsStyle='primary' onClick={this.props.handleRunSimulation}>Go</Button>
				</Form>
			</div>
		)
	}
}