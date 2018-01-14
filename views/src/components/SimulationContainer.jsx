import React, { Component } from 'react';
import SimulationSettings from './SimulationSettings.jsx';
import Simulation from './Simulation.jsx';
import CurrentSim from './CurrentSim.jsx';

export default class SimulationContainer extends Component {
	constructor() {
		super();

		this.state = {
			startingCrypto: 100,
			formSettings: {
				avgType: 'EMA',
				shortFrom: 5,
				shortTo: 15,
				longFrom: 20,
				longTo: 25
			},
			simSettings: {
				avgType: 'EMA',
				shortFrom: 5,
				shortTo: 15,
				longFrom: 10,
				longTo: 25
			},
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
		let val = e.target.value;
		this.setState(prevState => ({
			formSettings: {...prevState.formSettings, avgType: val}
		}));
	}

	handleChangeShortFrom(e) {
		let val = e.target.value;
		this.setState(prevState => ({
			formSettings: {...prevState.formSettings, shortFrom: val}
		}));
	}

	handleChangeShortTo(e) {
		let val = e.target.value;
		this.setState(prevState => ({
			formSettings: {...prevState.formSettings, shortTo: val}
		}));
	}

	handleChangeLongFrom(e) {
		let val = e.target.value;
		this.setState(prevState => ({
			formSettings: {...prevState.formSettings, longFrom: val}
		}));
	}

	handleChangeLongTo(e) {
		let val = e.target.value;
		this.setState(prevState => ({
			formSettings: {...prevState.formSettings, longTo: val}
		}));
	}

	handleRunSimulation(e) {
		this.setState({
			simSettings: this.state.formSettings
		});
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
					avgType={this.state.formSettings.avgType}
					shortFrom={this.state.formSettings.shortFrom}
					shortTo={this.state.formSettings.shortTo}
					longFrom={this.state.formSettings.longFrom}
					longTo={this.state.formSettings.longTo}
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
					avgType={this.state.simSettings.avgType}
					shortFrom={this.state.simSettings.shortFrom}
					shortTo={this.state.simSettings.shortTo}
					longFrom={this.state.simSettings.longFrom}
					longTo={this.state.simSettings.longTo}
					startingCrypto={this.state.startingCrypto}
					chartData={this.props.chartData}
					handleRowClick={this.props.handleRowClick}
				/>
			</div>
		)
	}
}