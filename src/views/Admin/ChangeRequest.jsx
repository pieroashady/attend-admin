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

import Axios from 'axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Parse from 'parse';
import ModalHandler from '../ModalHandler';
import moment from 'moment';
import '../datepicker.css';
import DateTime from 'react-datetime';

class ChangeRequest extends Component {
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
			statusReco: 0
		};

		//this.handleFilter = this.handleFilter.bind(this);
	}

	componentDidMount() {
		this.getStaff();
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
			.signUp()
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

		if (searchBy === 'name') {
			const ChangeRequest = Parse.Object.extend('ChangeRequest');
			const query = new Parse.Query(ChangeRequest);

			const userQuery = new Parse.Query(Parse.User);
			userQuery.matches('fullname', searchValue, 'i');

			query.matchesQuery('userId', userQuery);
			// query.matches('fullname', searchValue, 'i');
			// query.equalTo('roles', 'staff');
			query
				.find()
				.then((name) => {
					this.setState({ staff: name, loading: false });
				})
				.catch((err) => alert(err.message));
			return;
		}
		if (searchBy === 'all') {
			// const User = new Parse.User();
			const ChangeRequest = Parse.Object.extend('ChangeRequest');
			const query = new Parse.Query(ChangeRequest);
			// query.equalTo('roles', 'staff');
			query
				.find()
				.then((name) => {
					this.setState({ staff: name, loading: false });
				})
				.catch((err) => alert(err.message));
			return;
		}

		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		const userQuery = new Parse.Query(Parse.User);
		userQuery.matches('nik', searchValue.toUpperCase(), 'i');

		query.matchesQuery('userId', userQuery);
		// const User = new Parse.User();
		// const query = new Parse.Query(User);
		// query.equalTo('nik', searchValue.toUpperCase());
		// query.equalTo('roles', 'staff');
		query
			.find()
			.then((x) => {
				console.log(x);
				this.setState({ staff: x, loading: false });
			})
			.catch((err) => alert(err.message));
	};

	getStaff() {
		this.setState({ loading: true });
		const ChangeRequest = Parse.Object.extend('ChangeRequest');
		const query = new Parse.Query(ChangeRequest);

		query.include('userId');
		query
			.find()
			.then((x) => {
				console.log(x);
				this.setState({ staff: x, loading: false });
			})
			.catch((err) => {
				alert(err.message);
				this.setState({ loading: false });
			});
	}

	render() {
		const { staff, loading, loadingReco, message } = this.state;
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
					show={this.state.deleteMode}
					title="Reject confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleReject}
					loading={this.state.loading}
					body={'Reject izin ' + this.state.fullnames + ' ?'}
				/>

				<ModalHandler
					show={this.state.photoMode}
					title="Foto Wajah"
					footer={true}
					//handleSave={this.handleApprove}
					loading={this.state.loading}
					saveText="Download"
					handleHide={() => this.setState({ photoMode: false })}
					body={
						<div style={{ textAlign: 'center' }}>
							<img
								style={{ textAlign: 'center' }}
								width="50%"
								height={300}
								src={this.state.lampiran}
							/>
						</div>
					}
				/>

				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								title="Search by :"
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
																	'name'
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
												<Table striped hover id="ekspor">
													<thead>
														<tr>
															<th>NIK</th>
															<th>NAMA</th>
															<th>JAM KERJA</th>
															<th>SISA CUTI</th>
															<th>LEMBUR</th>
															<th>LOKASI KERJA</th>
															<th>ACTION</th>
														</tr>
													</thead>
													<tbody key={1}>
														{staff.map((prop, key) => (
															<tr key={key}>
																<td>
																	{
																		prop.get('userId')
																			.attributes.nik
																	}
																</td>
																<td>
																	{
																		prop.get('userId')
																			.attributes.fullname
																	}
																</td>
																<td>{prop.get('jamKerja')}</td>
																<td>{prop.get('jumlahCuti')}</td>
																<td>{prop.get('lembur')}</td>
																<td>{prop.get('lokasiKerja')}</td>
																<td>
																	<OverlayTrigger
																		placement="right"
																		overlay={tooltip(
																			'Lihat detail'
																		)}
																	>
																		<Button
																			className="btn-circle btn-primary mr-2"
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
																		overlay={tooltip('Approve')}
																	>
																		<Button
																			className="btn-circle btn-warning mr-2"
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
																			<i className="fa fa-check" />
																		</Button>
																	</OverlayTrigger>
																	<OverlayTrigger
																		placement="right"
																		overlay={tooltip('Reject')}
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
																			<i className="fa fa-close" />
																		</Button>
																	</OverlayTrigger>
																</td>
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

export default ChangeRequest;
