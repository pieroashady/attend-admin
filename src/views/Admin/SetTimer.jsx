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
import {
	Container,
	Row,
	Col,
	FormGroup,
	ControlLabel,
	FormControl,
	Form,
	Tooltip,
	OverlayTrigger,
	Table
} from 'react-bootstrap';

import { Card } from 'components/Card/Card.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';

import avatar from 'assets/img/faces/face-3.jpg';
import Axios from 'axios';
import * as faceapi from 'face-api.js';
import { baseurl } from 'utils/baseurl';
import Parse from 'parse';
import ModalHandler from '../ModalHandler';
import moment from 'moment';
import '../datepicker.css';
import DateTime from 'react-datetime';
import { Link } from 'react-router-dom';
import { handleConvert } from 'utils/converter';

class SetTimer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			trainee: [],
			staff: [],
			error: '',
			userId: '',
			status: 3,
			userIndex: 0,
			fullnames: '',
			loading: false,
			addMode: false,
			editMode: false,
			deleteMode: false,
			buttonLoading: false,
			checkAll: false,
			checkId: [],
			checkOne: false,
			lampiran: '',
			photoMode: false,
			searchValue: '',
			searchBy: 'all',
			fotoWajah: '',
			message: '',
			loadingReco: false,
			nama: '',
			nik: '',
			tipeKaryawan: 'Karyawan tetap',
			posisi: '',
			level: '',
			imei: '',
			jamKerja: 'Jam tetap',
			lokasiKerja: 'Tetap',
			jumlahCuti: 0,
			lembur: 'ya',
			username: '',
			password: '',
			statusReco: 0,
			leaders: [],
			selectLeader: '',
			timer: 0,
			setting: []
		};

		//this.handleFilter = this.handleFilter.bind(this);
	}

	componentDidMount() {
		this.getStaff();
		this.getLeader();
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		const {
			name,
			nik,
			tipeKaryawan,
			posisi,
			level,
			imei,
			jamKerja,
			lokasiKerja,
			jumlahCuti,
			lembur,
			fotoWajah,
			username,
			password
		} = this.state;

		const user = new Parse.User();
		const leader = new Parse.Object.extend('Leader');
		user.set('leaderId', leader.createWithoutData(this.state.selectLeader));
		user.set('fullname', name);
		user.set('username', username);
		user.set('password', password);
		user.set('nik', nik.toUpperCase());
		user.set('tipe', tipeKaryawan);
		user.set('posisi', posisi);
		user.set('level', level);
		user.set('imei', imei);
		user.set('jamKerja', jamKerja);
		user.set('lokasiKerja', lokasiKerja);
		user.set('jumlahCuti', parseInt(jumlahCuti));
		user.set('lembur', lembur);
		user.set('roles', level);
		user.set('fotoWajah', new Parse.File('profile.jpg', fotoWajah));
		user
			.save()
			.then((x) => {
				this.setState({
					staff: this.state.staff.concat(x),
					addMode: false,
					loading: false
				});
			})
			.catch((err) => {
				this.setState({ addMode: false, loading: false });
				alert(err.message);
			});
	};

	handleFace = (e) => {
		this.setState({ loadingReco: true, statusReco: 0, fotoWajah: e.target.files[0] });
		const formData = new FormData();
		formData.append('knax', e.target.files[0]);
		Axios.post('http://35.247.147.177:4000/api/face-check', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
			.then(({ data }) => {
				if (data.status === 1)
					return this.setState({
						statusReco: 1,
						message: `✔️ ${data.message}`,
						loadingReco: false
					});
				return this.setState({
					statusReco: 0,
					message: `✖️ ${data.message}`,
					loadingReco: false
				});
			})
			.catch((err) => alert('Terjadi error...'));
	};

	handleFilter = (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		const { searchBy, searchValue } = this.state;

		console.log(searchBy);

		const User = new Parse.User();
		const query = new Parse.Query(User);

		switch (searchBy) {
			case 'name':
				query.matches('fullname', searchValue, 'i');
				query.equalTo('roles', 'staff');
				query
					.find()
					.then((name) => {
						this.setState({ staff: name, loading: false });
					})
					.catch((err) => alert(err.message));
				return;
			case 'all':
				query.equalTo('roles', 'staff');
				query
					.find()
					.then((name) => {
						this.setState({ staff: name, loading: false });
					})
					.catch((err) => alert(err.message));
				return;

			case 'leader':
				const ChangeRequest = Parse.Object.extend('Leader');
				const query = new Parse.Query(ChangeRequest);

				const userQuery = new Parse.Query(Parse.User);
				query.matches('fullname', searchValue, 'i');

				userQuery.matchesQuery('leaderId', query);
				// query.matches('fullname', searchValue, 'i');
				// query.equalTo('roles', 'staff');
				userQuery
					.find()
					.then((name) => {
						this.setState({ staff: name, loading: false });
					})
					.catch((err) => alert(err.message));
				return;

			default:
				break;
		}

		query.equalTo('nik', searchValue.toUpperCase());
		query.equalTo('roles', 'staff');
		query
			.find()
			.then((x) => {
				console.log(x);
				this.setState({ staff: x, loading: false });
			})
			.catch((err) => alert(err.message));
	};

	getLeader() {
		const Leader = Parse.Object.extend('Leader');
		const query = new Parse.Query(Leader);

		query.find().then((x) => {
			this.setState({ leaders: x });
		});
	}

	getStaff() {
		this.setState({ loading: true });
		const ValidationTimer = new Parse.Object.extend('ValidationTimer');
		const query = new Parse.Query(ValidationTimer);

		query
			.find()
			.then((x) => {
				this.setState({ setting: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	}

	render() {
		const { staff, loading, loadingReco, message, setting } = this.state;
		//izin.map((x) => this.setState({ status: x.get('status') }));
		//console.log('status', izin[0].status);
		const tooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Reject confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleReject}
					loading={this.state.loading}
					body={'Reject izin ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					size="lg"
					show={this.state.photoMode}
					title="Lampiran staff"
					//handleSave={this.handleApprove}
					loading={this.state.loading}
					saveText="Download"
					handleHide={() => this.setState({ photoMode: false })}
					body={<img width="100%" height="100%" src={this.state.lampiran} />}
				/>
				<ModalHandler
					show={this.state.deleteMode}
					title="Reject confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleReject}
					loading={this.state.loading}
					body={'Reject izin ' + this.state.fullnames + ' ?'}
				/>
				<ModalHandler
					show={this.state.addMode}
					title="Setting"
					handleHide={() => this.setState({ addMode: false })}
					body={
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formNama">
								<Form.Label>Timer Validasi</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="number"
									placeholder="Masukkan timer"
									onChange={(e) => this.setState({ timer: e.target.value })}
								/>
							</Form.Group>

							<Button variant="primary" type="submit">
								Save
							</Button>
						</Form>
					}
				/>

				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Settings"
								content={
									<div>
										<Row>
											{setting.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												<Table striped hover>
													<thead>
														<tr>
															<th>NO</th>
															<th>TIMER</th>
															<th>ACTION</th>
														</tr>
													</thead>
													<tbody key={1}>
														{setting.map((prop, key) => (
															<tr key={key}>
																<td>{key + 1}</td>
																<td>{prop.get('timer')}</td>
																<td>
																	<OverlayTrigger
																		placement="right"
																		overlay={tooltip(
																			'Lihat detail'
																		)}
																	>
																		<Button
																			className="btn-circle btn-primary mr-1"
																			onClick={() => {
																				this.setState({
																					photoMode: true,
																					lampiran: prop.attributes.fotoWajah.url()
																				});
																			}}
																		>
																			<i className="fa fa-eye" />
																		</Button>
																	</OverlayTrigger>

																	<OverlayTrigger
																		placement="right"
																		overlay={tooltip('Edit')}
																	>
																		<Button
																			className="btn-circle btn-warning mr-1"
																			onClick={() => {
																				this.setState({
																					editMode: true,
																					userId: prop.id,
																					userIndex: key,
																					fullnames: prop.get(
																						'fullname'
																					)
																				});
																			}}
																		>
																			<i className="fa fa-edit" />
																		</Button>
																	</OverlayTrigger>
																	<OverlayTrigger
																		placement="right"
																		overlay={tooltip('Hapus')}
																	>
																		<Button
																			className="btn-circle btn-danger"
																			onClick={(e) => {
																				this.setState({
																					deleteMode: true,
																					userId: prop.id,
																					userIndex: key,
																					fullnames: prop.get(
																						'fullname'
																					)
																				});
																			}}
																		>
																			<i className="fa fa-trash" />
																		</Button>
																	</OverlayTrigger>
																</td>
																{/* <td>
																	{moment(
																		prop.get('dari')
																	).format('DD/MM/YYYY')}
																</td>
																<td>
																	{moment(
																		prop.get('sampai')
																	).format('DD/MM/YYYY')}
																</td>
																{prop.get('status') == 3 ? (
																	<td>
																		{prop.attributes
																			.attachFile ==
																		undefined ? (
																			''
																		) : (
																			<OverlayTrigger
																				placement="right"
																				overlay={tooltip(
																					'Lihat lampiran'
																				)}
																			>
																				<Button
																					className="btn-circle btn-warning mr-2"
																					onClick={() => {
																						this.setState(
																							{
																								photoMode: true,
																								lampiran: prop.attributes.attachFile.url()
																							}
																						);
																					}}
																				>
																					<i className="fa fa-eye" />
																				</Button>
																			</OverlayTrigger>
																		)}
																		<OverlayTrigger
																			placement="right"
																			overlay={tooltip(
																				'Lampiran'
																			)}
																		>
																			<Button
																				className="btn-circle btn-warning mr-2"
																				onClick={() => {
																					this.setState({
																						editMode: true,
																						userId:
																							prop.id,
																						userIndex: key,
																						fullnames: prop.get(
																							'fullname'
																						)
																					});
																				}}
																			>
																				<i className="fa fa-check" />
																			</Button>
																		</OverlayTrigger>
																		<OverlayTrigger
																			placement="right"
																			overlay={tooltip(
																				'Reject'
																			)}
																		>
																			<Button
																				className="btn-circle btn-danger"
																				onClick={(e) => {
																					this.setState({
																						deleteMode: true,
																						userId:
																							prop.id,
																						userIndex: key,
																						fullnames: prop.get(
																							'fullname'
																						)
																					});
																				}}
																			>
																				<i className="fa fa-close" />
																			</Button>
																		</OverlayTrigger>
																	</td>
																) : prop.get('status') == 0 ? (
																	<td>Rejected</td>
																) : (
																	<td>Approved</td>
																)} */}
															</tr>
														))}
													</tbody>
												</Table>
											)}
										</Row>
									</div>
								}
							/>
						</Col>
					</Row>

					{/* </Col> */}
					{/* </Row> */}
				</Container>
			</div>
		);
	}
}

export default SetTimer;
