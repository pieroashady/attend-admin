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

class RegisterStaff extends Component {
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
			selectLeader: ''
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
		const User = new Parse.User();
		const query = new Parse.Query(User);

		const d = new Date();
		const start = new moment(d);
		start.startOf('day');
		const finish = new moment(start);
		finish.add(1, 'day');
		console.log('start', start.toDate());
		console.log('finsih', finish.toDate());

		query.include('leaderId');
		query.equalTo('roles', 'staff');
		query
			.find()
			.then((x) => {
				console.log(x);
				console.log('status', x[0]);
				this.setState({ staff: x, loading: false });
			})
			.catch((err) => alert(err.message));
	}

	render() {
		const { staff, loading, loadingReco, message } = this.state;
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
					title="Tambah karyawan"
					handleHide={() => this.setState({ addMode: false })}
					body={
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formNama">
								<Form.Label>Nama</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									placeholder="Masukkan nama"
									onChange={(e) => this.setState({ name: e.target.value })}
								/>
							</Form.Group>

							<Form.Group controlId="formLeaders">
								<Form.Label>Pilih leader</Form.Label>
								<Form.Control
									as="select"
									required={true}
									onChange={(e) =>
										this.setState({
											selectLeader: e.target.value
										})}
								>
									<option>Pilih leader</option>
									{this.state.leaders.map((x, i) => (
										<option key={i} value={x.id}>
											{x.get('fullname')}
										</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="formUsername">
								<Form.Label>Username</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									placeholder="Masukkan username"
									onChange={(e) => this.setState({ username: e.target.value })}
								/>
							</Form.Group>

							<Form.Group controlId="formPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="password"
									placeholder="Masukkan password"
									onChange={(e) => this.setState({ password: e.target.value })}
								/>
							</Form.Group>

							<Form.Group controlId="formNik">
								<Form.Label>NIK</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									placeholder="Masukkan NIK"
									onChange={(e) =>
										this.setState({ nik: e.target.value.toUpperCase() })}
								/>
							</Form.Group>

							<Form.Group controlId="formTipex">
								<Form.Label>Tipe karyawan</Form.Label>
								<Form.Control
									as="select"
									onChange={(e) =>
										this.setState({
											tipeKaryawan: e.target.value
										})}
								>
									{[ 'Karyawan tetap', 'PKWT', 'Magan' ].map((x, i) => (
										<option key={i} value={x}>
											{x}
										</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="formPosisi">
								<Form.Label>Posisi</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									placeholder="Masukkan posisi"
									onChange={(e) =>
										this.setState({ posisi: e.target.value.toUpperCase() })}
								/>
							</Form.Group>

							<Form.Group controlId="formTipe">
								<Form.Label>Level</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									placeholder="Masukkan Level"
									onChange={(e) => this.setState({ level: e.target.value })}
								/>
							</Form.Group>

							<Form.Group controlId="formCategory">
								<Form.File label="Foto wajah" onChange={this.handleFace} />
								<Form.Text
									className={loadingReco ? 'text-muted' : ''}
									style={{
										color: `${this.state.statusReco == 0 ? 'red' : 'green'}`
									}}
								>
									{loadingReco ? 'processing...' : message}
								</Form.Text>
							</Form.Group>

							<Form.Group controlId="formImei">
								<Form.Label>IMEI</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									placeholder="Masukkan imei hp"
									onChange={(e) => this.setState({ imei: e.target.value })}
								/>
							</Form.Group>

							<Form.Group controlId="formJam">
								<Form.Label>Jam kerja</Form.Label>
								<Form.Control
									as="select"
									defaultValue="all"
									onChange={(e) =>
										this.setState({
											jamKerja: e.target.value
										})}
								>
									{[ 'Jam tetap', 'Jam fleksibel', 'Jam bebas' ].map((x) => (
										<option value={x}>{x}</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="formLokasi">
								<Form.Label>Lokasi kerja</Form.Label>
								<Form.Control
									as="select"
									defaultValue="all"
									onChange={(e) =>
										this.setState({
											lokasiKerja: e.target.value
										})}
								>
									{[ 'Tetap', 'Bebas (mobile)' ].map((x) => (
										<option value={x}>{x}</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="formCuti">
								<Form.Label>Jumlah cuti</Form.Label>
								<Form.Control
									type="number"
									placeholder="Masukkan jumlah cuti"
									onChange={(e) =>
										this.setState({ jumlahCuti: parseInt(e.target.value) })}
								/>
							</Form.Group>

							<Form.Group controlId="formLembut">
								<Form.Label>Lembur</Form.Label>
								<Form.Control
									as="select"
									defaultValue="all"
									onChange={(e) =>
										this.setState({
											lembur: e.target.value
										})}
								>
									{[ 'Ya', 'Tidak' ].map((x) => <option value={x}>{x}</option>)}
								</Form.Control>
							</Form.Group>

							<Button
								variant={this.state.statusReco === 0 ? 'default' : 'primary'}
								type="submit"
								disabled={this.state.statusReco === 0 ? true : false}
							>
								{this.state.statusReco === 0 ? (
									'upload foto dahulu'
								) : this.state.loading ? (
									'Please wait..'
								) : (
									'Submit'
								)}
							</Button>
						</Form>
					}
				/>

				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								category={
									<Button
										variant="primary"
										className="btn-primary"
										type="submit"
										onClick={(e) => this.setState({ addMode: true })}
										disable={loading ? 'true' : 'false'}
									>
										<i className="fa fa-plus" />{' '}
										{loading ? 'Fetching...' : 'Registrasi Karyawan'}
									</Button>
								}
								content={
									<div>
										<Row>
											<Col>
												<Form
													onSubmit={this.handleFilter}
													style={{ marginBottom: '20px' }}
												>
													<Form.Group
														as={Row}
														controlId="formHorizontalEmails"
													>
														<Col sm={2}>
															<Form.Control
																as="select"
																defaultValue="all"
																onChange={(e) =>
																	this.setState({
																		searchBy: e.target.value
																	})}
															>
																{[
																	'all',
																	'nik',
																	'name',
																	'leader'
																].map((x) => (
																	<option value={x}>{x}</option>
																))}
															</Form.Control>
														</Col>
														<Col sm={4} className="pull-right">
															<Form.Control
																disabled={
																	this.state.searchBy ===
																	'all' ? (
																		true
																	) : (
																		false
																	)
																}
																type="text"
																placeholder={`Masukkan ${this.state
																	.searchBy}`}
																onChange={(e) =>
																	this.setState({
																		searchValue: e.target.value
																	})}
															/>
														</Col>
														<Col sm={4}>
															<Button
																variant="primary"
																type="submit"
																disable={loading ? 'true' : 'false'}
															>
																<i className="fa fa-search" />{' '}
																{loading ? 'Fetching...' : 'Search'}
															</Button>
														</Col>
													</Form.Group>
												</Form>
											</Col>
										</Row>
										<Row>
											{staff.length < 1 ? (
												<Col md={12}>No data found...</Col>
											) : (
												<Table striped hover>
													<thead>
														<tr>
															<th>NIK</th>
															<th>NAMA</th>
															<th>NAMA LEADER</th>
															<th>TIPE KARYAWAN</th>
															<th>POSISI</th>
															<th>LEVEL</th>
															<th>ACTION</th>
														</tr>
													</thead>
													<tbody key={1}>
														{staff.map((prop, key) => (
															<tr key={key}>
																<td>{prop.get('nik')}</td>
																<td>{prop.get('fullname')}</td>
																<td>
																	{
																		prop.get('leaderId')
																			.attributes.fullname
																	}
																</td>
																<td>{prop.get('tipe')}</td>
																<td>{prop.get('posisi')}</td>
																<td>{prop.get('level')}</td>
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

export default RegisterStaff;
