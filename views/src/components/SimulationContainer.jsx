import React, { Component } from 'react';
import SimulationSettings from './SimulationSettings.jsx';
import Simulation from './Simulation.jsx';
import SimulationSummary from './SimulationSummary.jsx';

export default class SimulationContainer extends Component {

	render() {
		return (
			<div className='simulationContainer'>
				<SimulationSettings
					avgType={this.props.avgType}
					shortWindow={this.props.shortWindow}
					longWindow={this.props.longWindow}
					handleChangeAvgType={this.props.handleChangeAvgType}
					handleChangeShortWindow={this.props.handleChangeShortWindow}
					handleChangeLongWindow={this.props.handleChangeLongWindow}
					handleSubmit={this.props.handleSubmit}
				/>
				<SimulationSummary
					simOutput={this.props.simOutput}
				/>
				<Simulation
					simOutput = {this.props.simOutput}
				/>
			</div>
		)
	}
}