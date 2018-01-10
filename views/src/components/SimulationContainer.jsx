import React, { Component } from 'react';
import SimulationSettings from './SimulationSettings.jsx';
import Simulation from './Simulation.jsx';
import CurrentSim from './CurrentSim.jsx';

export default class SimulationContainer extends Component {
	constructor() {
		super();

		this.state = {
			startingCrypto: 100,
			avgType: 'EMA',
			shortFrom: 10,
			shortTo: 20,
			longFrom: 20,
			longTo: 40,
			simOutput:{}
		}

		this.handleChangeAvgType=this.handleChangeAvgType.bind(this);
		this.handleChangeShortFrom=this.handleChangeShortFrom.bind(this);
		this.handleChangeShortTo=this.handleChangeShortTo.bind(this);
		this.handleChangeLongFrom=this.handleChangeLongFrom.bind(this);
		this.handleChangeLongTo=this.handleChangeLongTo.bind(this);
		this.handleRunSimulation=this.handleRunSimulation.bind(this);
	}

	handleChangeAvgType(e) {
		this.setState({
			avgType: e.target.value
		});
	}

	handleChangeShortFrom(e) {
		this.setState({
			shortFrom: e.target.value
		});
	}

	handleChangeShortTo(e) {
		this.setState({
			shortTo: e.target.value
		});
	}

	handleChangeLongFrom(e) {
		this.setState({
			longFrom: e.target.value
		});
	}

	handleChangeLongTo(e) {
		this.setState({
			longTo: e.target.value
		});
	}

	handleRunSimulation(e) {
		alert();
	}

	render() {
		return (
			<div className='simulationContainer'>
				<CurrentSim
					pair={this.props.pair}
					avgType={this.props.avgType}
					shortWindow={this.props.shortWindow}
					longWindow={this.props.longWindow}
					signals={this.props.signals}
					startingCrypto={this.state.startingCrypto}
				/>
				<SimulationSettings
					avgType={this.state.avgType}
					shortFrom={this.state.shortFrom}
					shortTo={this.state.shortTo}
					longFrom={this.state.longFrom}
					longTo={this.state.longTo}
					startingCrypto={this.state.startingCrypto}
					handleChangeAvgType={this.handleChangeAvgType}
					handleChangeShortFrom={this.handleChangeShortFrom}
					handleChangeShortTo={this.handleChangeShortTo}
					handleChangeLongFrom={this.handleChangeLongFrom}
					handleChangeLongTo={this.handleChangeLongTo}
					handleRunSimulation={this.handleRunSimulation}
				/>
				<Simulation
					pair={this.props.pair}
					avgType={this.props.avgType}
					shortFrom={this.state.shortFrom}
					shortTo={this.state.shortTo}
					longFrom={this.state.longFrom}
					longTo={this.state.longTo}
					startingCrypto={this.state.startingCrypto}
					chartData={this.props.chartData}
				/>
			</div>
		)
	}
}