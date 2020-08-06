/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from 'react';
import axios from 'axios';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col, Spinner } from 'react-bootstrap';

import { Card } from 'components/Card/Card.jsx';
import { StatsCard } from 'components/StatsCard/StatsCard.jsx';
import { Tasks } from 'components/Tasks/Tasks.jsx';
import {
	dataPie,
	legendPie,
	dataSales,
	optionsSales,
	responsiveSales,
	legendSales,
	dataBar,
	optionsBar,
	responsiveBar,
	legendBar
} from 'variables/Variables.jsx';
import { baseurl } from 'utils/baseurl';
import Axios from 'axios';
import moment from 'moment';
import Parse from 'parse';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			totalAbsen: 0,
			totalTerlambat: 0,
			totalIzin: 0,
			totalSakit: 0,
			totalOvertime: 0,
			totalRequest: 0,
			percentage: {},
			loading: false,
			jumlahKaryawan: 0
		};
	}

	componentDidMount() {
		this.getTotalAbsen();
		this.getTotalTerlambat();
		this.getTotalIzin();
		this.getTotalRequest();
		this.getTotalSakit();
		this.getTotalOvertime();
		this.getStaff();
	}

	getStaff() {
		this.setState({ loading: true });
		const User = new Parse.User();
		const query = new Parse.Query(User);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');
		console.log('start', start.toDate());
		console.log('finsih', finish.toDate());

		query.equalTo('exclude', false);
		//query.equalTo('roles', 'staff');
		query
			.count()
			.then((x) => {
				this.setState({ jumlahKaryawan: x, loading: false });
			})
			.catch((err) => alert(err.message));
	}

	getPercentage() {}

	getTotalAbsen = () => {
		this.setState({ loading: true });
		const Absence = Parse.Object.extend('Absence');
		const query = new Parse.Query(Absence);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());

		query
			.count()
			.then((x) => {
				this.setState({ totalAbsen: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	getTotalTerlambat = () => {
		const Late = Parse.Object.extend('Late');
		const query = new Parse.Query(Late);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());

		query
			.count()
			.then((x) => {
				this.setState({ totalTerlambat: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	getTotalIzin = () => {
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.equalTo('statusIzin', 1);
		query
			.count()
			.then((x) => {
				this.setState({ totalIzin: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	getTotalSakit = () => {
		const Izin = Parse.Object.extend('Izin');
		const query = new Parse.Query(Izin);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.equalTo('statusIzin', 2);
		query
			.count()
			.then((x) => {
				this.setState({ totalSakit: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	getTotalRequest = () => {
		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		// const d = new Date();
		// 		const start = new moment(d);
		// 		start.startOf('day');
		// 		const finish = new moment(start);
		// 		finish.add(1, 'day');

		// 		query.greaterThanOrEqualTo('createdAt', start.toDate());
		// 		query.lessThan('createdAt', finish.toDate());
		query.equalTo('statusApprove', 0);
		query
			.count()
			.then((x) => {
				this.setState({ totalRequest: x });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	getTotalOvertime = () => {
		const Overtime = Parse.Object.extend('Overtime');
		const query = new Parse.Query(Overtime);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');

		query.greaterThanOrEqualTo('createdAt', start.toDate());
		query.lessThan('createdAt', finish.toDate());
		query.equalTo('statusIzin');
		query
			.count()
			.then((x) => {
				this.setState({ totalOvertime: x, loading: false });
			})
			.catch(({ message }) => {
				this.setState({ loading: false });
				alert(message);
				window.location.reload(false);
			});
	};

	createLegend(json) {
		var legend = [];
		for (var i = 0; i < json['names'].length; i++) {
			var type = 'fa fa-circle text-' + json['types'][i];
			legend.push(<i className={type} key={i} />);
			legend.push(' ');
			legend.push(json['names'][i]);
		}
		return legend;
	}
	render() {
		const {
			totalAbsen,
			totalIzin,
			totalOvertime,
			totalRequest,
			totalSakit,
			totalTerlambat,
			loading
		} = this.state;
		console.log(totalAbsen / (totalAbsen + totalTerlambat) * 100);

		const dataPiex = {
			labels: [
				totalAbsen === 0
					? 'No Data'
					: `${totalAbsen / (totalAbsen + totalTerlambat) * 100}%`,
				totalTerlambat === 0
					? 'No Data'
					: `${totalTerlambat / (totalAbsen + totalTerlambat) * 100}%`
			],
			series: [
				totalAbsen / (totalAbsen + totalTerlambat) * 100,
				totalTerlambat / (totalAbsen + totalTerlambat) * 100
			]
		};

		return (
			<div className="content">
				{loading ? (
					<div style={{ textAlign: 'center' }}>
						<Spinner animation="border" role="status" />
						<p>Sedang memuat...</p>
					</div>
				) : (
					<div>
						<Row>
							<Col lg={4} sm={12} md={12}>
								<Link to="/admin/register" style={{ color: 'inherit' }}>
									<StatsCard
										bigIcon={<i className="pe-7s-users text-success" />}
										statsText="Jumlah Karyawan"
										statsValue={this.state.jumlahKaryawan}
										//statsIcon={<i className="fa fa-percent" />}
										// statsIconText={`Persentase ${totalAbsen === 0
										// 	? '0%'
										// 	: `${totalAbsen /
										// 			(totalAbsen + totalTerlambat) *
										// 			100}%`}`}
									/>
								</Link>
							</Col>
							<Col lg={4} sm={12} md={12}>
								<Link to="/admin/late" style={{ color: 'inherit' }}>
									<StatsCard
										bigIcon={<i className="pe-7s-next text-danger" />}
										statsText="Terlambat"
										statsValue={totalTerlambat}
										statsIconText={`Persentase ${totalTerlambat === 0
											? '0%'
											: `${totalTerlambat /
													(totalAbsen + totalTerlambat) *
													100}%`}`}
									/>
								</Link>
							</Col>
							<Col lg={4} sm={12} md={12}>
								<Link to="/admin/izin" style={{ color: 'inherit' }}>
									<StatsCard
										bigIcon={<i className="pe-7s-plane text-primary" />}
										statsText="Request izin"
										statsValue={totalIzin}
										statsIconText={`Approved: ${0} Rejected: ${0}`}
									/>
								</Link>
							</Col>
						</Row>
						<Row>
							<Col lg={4} sm={12} md={12}>
								<Link to="/admin/statusrequest" style={{ color: 'inherit' }}>
									<StatsCard
										bigIcon={<i className="fa fa-history text-dark" />}
										statsText="Request Waiting"
										statsValue={totalRequest}
										statsIconText={`Approved: ${0} Rejected: ${0}`}
									/>
								</Link>
							</Col>
							<Col lg={4} sm={12} md={12}>
								<Link to="/admin/overtime" style={{ color: 'inherit' }}>
									<StatsCard
										bigIcon={<i className="pe-7s-moon text-info" />}
										statsText="Request overtime"
										statsValue={totalOvertime}
										statsIconText={`Approved: ${0} Rejected: ${0}`}
									/>
								</Link>
							</Col>
							<Col lg={4} sm={12} md={12}>
								<Link to="/admin/cuti" style={{ color: 'inherit' }}>
									<StatsCard
										bigIcon={<i className="fa fa-balance-scale text-warning" />}
										statsText="Request cuti"
										statsValue={totalSakit}
										statsIconText={`Approved: ${0} Rejected: ${0}`}
									/>
								</Link>
							</Col>
						</Row>
						<Row className="justify-content-center">
							<Col lg={6} sm={6} className="justify-content-center">
								<Card
									statsIcon="fa fa-clock-o"
									title="Presentase keterlambatan hari ini"
									category="Last Campaign Performance"
									stats={
										'Dimuat pada ' +
										moment().format('D MMMM YYYY [pukul] HH:mm:ss')
									}
									content={
										<div
											id="chartPreferences"
											className="ct-chart ct-perfect-fourth"
										>
											<ChartistGraph
												data={
													totalAbsen / (totalAbsen + totalTerlambat) ===
													NaN ? (
														'No Data'
													) : (
														dataPiex
													)
												}
												type="Pie"
											/>
										</div>
									}
									legend={
										<div className="legend">{this.createLegend(legendPie)}</div>
									}
								/>
							</Col>
						</Row>
					</div>
				)}
			</div>
		);
	}
}

const FirstDashboard = () => {
	return (
		<div>
			<Row>
				<Col lg={3} sm={6}>
					<StatsCard
						bigIcon={<i className="pe-7s-graph1 text-danger" />}
						statsText="Errors"
						statsValue="23"
						statsIcon={<i className="fa fa-clock-o" />}
						statsIconText="In the last hour"
					/>
				</Col>
				<Col lg={3} sm={6}>
					<StatsCard
						bigIcon={<i className="fa fa-twitter text-info" />}
						statsText="Followers"
						statsValue="+45"
						statsIcon={<i className="fa fa-refresh" />}
						statsIconText="Updated now"
					/>
				</Col>
			</Row>
			<Row>
				<Col md={8}>
					<Card
						statsIcon="fa fa-history"
						id="chartHours"
						title="Users Behavior"
						category="24 Hours performance"
						stats="Updated 3 minutes ago"
						content={
							<div className="ct-chart">
								<ChartistGraph
									data={dataSales}
									type="Line"
									options={optionsSales}
									responsiveOptions={responsiveSales}
								/>
							</div>
						}
						legend={<div className="legend">{this.createLegend(legendSales)}</div>}
					/>
				</Col>
				<Col md={4}>
					<Card
						statsIcon="fa fa-clock-o"
						title="Email Statistics"
						category="Last Campaign Performance"
						stats="Campaign sent 2 days ago"
						content={
							<div id="chartPreferences" className="ct-chart ct-perfect-fourth">
								<ChartistGraph data={dataPie} type="Pie" />
							</div>
						}
						legend={<div className="legend">{this.createLegend(legendPie)}</div>}
					/>
				</Col>
			</Row>

			<Row>
				<Col md={6}>
					<Card
						id="chartActivity"
						title="2014 Sales"
						category="All products including Taxes"
						stats="Data information certified"
						statsIcon="fa fa-check"
						content={
							<div className="ct-chart">
								<ChartistGraph
									data={dataBar}
									type="Bar"
									options={optionsBar}
									responsiveOptions={responsiveBar}
								/>
							</div>
						}
						legend={<div className="legend">{this.createLegend(legendBar)}</div>}
					/>
				</Col>

				<Col md={6}>
					<Card
						title="Tasks"
						category="Backend development"
						stats="Updated 3 minutes ago"
						statsIcon="fa fa-history"
						content={
							<div className="table-full-width">
								<table className="table">
									<Tasks />
								</table>
							</div>
						}
					/>
				</Col>
			</Row>
		</div>
	);
};

const SecondDashboard = () => {
	return (
		<div>
			<div className="row">
				<div className="col-xl-6 col-md-6 mb-2">
					<div className="card border-left-success shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-success text-uppercase mb-1">
										Completed(11)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												42
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 22 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">33</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6 col-md-6 mb-2">
					<div className="card border-left-primary shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
										Uncompleted
									</div>
									<div className="h5 mb-0 font-weight-bold text-gray-800">23</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">42</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-info shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-info text-uppercase mb-1">
										Approved (55)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												33
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 41 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">44</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-warning shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
										Rejected (41)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												33
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 22 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">41</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-danger shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
										Cancelled (21)
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												24
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 33 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">44</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-md-6 mb-4">
					<div className="card border-left-gray shadow h-100 py-2">
						<div className="card-body">
							<div className="row no-gutters align-items-center">
								<div className="col mr-2">
									<div className="text-xs font-weight-bold text-gray text-uppercase mb-1">
										PENDING
									</div>
									<div className="row no-gutters align-items-center">
										<div className="col-auto">
											<div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
												21
											</div>
										</div>
										<div className="col">
											<div className="progress progress-sm mr-2">
												<div
													className="progress-bar bg-info"
													role="progressbar"
													style={{ width: 22 }}
													aria-valuenow={50}
													aria-valuemin={0}
													aria-valuemax={100}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-auto">
									<div className="text-lg font-weight-bold text-gray-800">32</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="d-sm-flex align-items-center justify-content-between">
				<h1 className="h3 mb-0 text-gray-800">Service level</h1>
			</div>

			<div className="row justify-content-center mb-4">
				<div className="d-flex justify-content-start mb-2">
					<svg
						className="hexagon green noselect"
						data-progress={24}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							Same day
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>

				<div className="d-flex justify-content-start">
					<svg
						className="hexagon primary noselect"
						data-progress={32}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							1 day
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>

						<text className="text" x="50%" y="122%">
							1 day
						</text>
					</svg>
				</div>
				<div className="d-flex justify-content-start">
					<svg
						className="hexagon blue noselect"
						data-progress={23}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							2 days
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>
				<div className="d-flex justify-content-start">
					<svg
						className="hexagon yellow noselect"
						data-progress={12}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							3 days
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>
				<div className="d-flex justify-content-start">
					<svg
						className="hexagon red noselect"
						data-progress={20}
						x="0px"
						y="0px"
						viewBox="0 0 776 628"
					>
						<text className="text" x="50%" y="122%">
							&gt;3 days
						</text>
						<path
							className="track"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<path
							className="fill"
							d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
						/>
						<text className="value" x="50%" y="61%">
							0%
						</text>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
