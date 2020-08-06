import React, { Component } from 'react';
import { Container, Row, Col, Tooltip, Button, Modal, Form, FormCheck } from 'react-bootstrap';
import Card from 'components/Card/Card';
import ChartistGraph from 'react-chartist';
import Axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import DateTime from 'react-datetime';
import '../datepicker.css';
import sort from 'fast-sort';
import { baseurl } from '../../utils/baseurl';
import ModalHandler from '../ModalHandler';
import Parse from 'parse';
import * as env from '../../env';

Parse.initialize(env.APPLICATION_ID, env.JAVASCRIPT_KEY, env.MASTER_KEY);
Parse.serverURL = env.SERVER_URL;

class MasterContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentImage: '',
			contentBody: '',
			contentTitle: '',
			contentType: 'Bootcamp',
			batch: [],
			content: [],
			contentIndex: 0,
			loading: false,
			modal: false,
			contentIndex: 0,
			editMode: false,
			deleteMode: false,
			contentDesc: '',
			contentId: '',
			schedule: moment().format('DD/MM/YYYY [at] hh:mm:ss'),
			schedulex: moment(),
			buttonLoading: false,
			moment: moment().format('DD/MM/YYYY [at] hh:mm:ss')
		};

		this.handleDate = this.handleDate.bind(this);
		this.handleDaySelect = this.handleDaySelect.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		this.handleDesc = this.handleDesc.bind(this);
		this.handleSubtitle = this.handleSubtitle.bind(this);
		this.handleTime = this.handleTime.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleHide = this.handleHide.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	componentDidMount() {
		this.getCategory();
	}

	handleSubmit(e) {
		e.preventDefault();
		const {
			contentImage,
			contentBody,
			contentTitle,
			contentType,
			batch,
			schedulex
		} = this.state;

		const BootcampEvent = Parse.Object.extend('BootcampEvent');
		const myNewObject = new BootcampEvent();

		myNewObject.set('status', 1);
		myNewObject.set('contentFile', new Parse.File('profile.jpg', contentImage));
		myNewObject.set('contentType', contentType);
		myNewObject.set('contentTitle', contentTitle);
		myNewObject.set('contentBody', contentBody);
		myNewObject.set('batch', batch);
		myNewObject.set('schedule', schedulex);
		console.log('sched', schedulex);
		myNewObject
			.save()
			.then((x) => {
				console.log('success', {
					objectId: x.id,
					contentBody: x.get('contentBody'),
					contentFile: x.get('contentFile').url(),
					contentTitle: x.get('contentTitle'),
					schedule: x.get('schedule'),
					updatedAt: x.get('updatedAt')
				});
				console.log('data', x);
				this.setState({
					modal: false,
					batch: []
				});
				window.location.reload(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleEdit(id, idx) {
		console.log(id);
		const {
			contentImage,
			contentBody,
			contentTitle,
			contentType,
			batch,
			schedulex,
			contentId
		} = this.state;

		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);

		query.get(id).then((x) => {
			console.log(x);
			this.setState({
				contentId: id,
				editMode: true,
				contentBody: x.get('contentBody'),
				contentImage: '',
				contentTitle: x.get('contentTitle'),
				schedulex: x.get('schedule'),
				updatedAt: x.get('updatedAt')
			});
		});
	}

	handleUpdate(e) {
		e.preventDefault();
		this.setState({ buttonLoading: true });
		const {
			contentImage,
			contentBody,
			contentTitle,
			contentType,
			batch,
			schedulex,
			contentId
		} = this.state;

		console.log(contentId, contentImage, contentType, contentBody);

		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);

		// query.equalTo('objectId', contentId);
		query.get(contentId).then((x) => {
			x.set('status', 1);
			if (contentImage !== '')
				x.set('contentFile', new Parse.File('profile.jpg', contentImage));
			x.set('contentType', contentType);
			x.set('contentTitle', contentTitle);
			x.set('contentBody', contentBody);
			x.set('batch', batch);
			x.set('schedule', schedulex);
			x
				.save()
				.then((zero) => {
					this.setState({ editMode: false, buttonLoading: false });
					window.location.reload(false);
				})
				.catch((err) => {
					this.setState({ buttonLoading: false });
					console.log(err);
				});
		});
	}

	handleDelete() {
		const data = { contentId: this.state.contentId };
		this.setState({ buttonLoading: true });

		Axios.post(baseurl('content/delete'), data)
			.then(({ data }) => {
				const newContent = [ ...this.state.content ];
				newContent.splice(this.state.contentIndex, 1);
				this.setState({
					content: newContent,
					deleteMode: false
				});
			})
			.catch((err) => console.log(err));
	}

	handleDate(moment) {
		this.setState({
			schedule: moment().format('DD/MM/YYYY [at] hh:mm:ss')
			//schedulex: moment(this.state.schedule, moment.defaultFormatUtc).toDate()
		});
	}

	handleCategory(e) {
		console.log(e.target.value);
		this.setState({ contentTitle: e.target.value });
	}

	handleSubtitle(e) {
		console.log(e.target.value);
		this.setState({ contentBody: e.target.value });
	}

	handleDesc(e) {
		this.setState({ desc: e.target.value });
	}

	handleTime(e) {
		this.setState({ timeInMinutes: e.target.value });
	}

	handleDaySelect(event) {
		const { batch } = this.state;
		let batchList = batch;
		let check = event.target.checked;
		let checkedBatch = parseInt(event.target.value);
		if (check) {
			console.log(check);
			this.setState(
				(prevState) => ({
					batch: [ ...this.state.batch, checkedBatch ]
				}),
				() => console.log(sort(this.state.batch).asc())
			);
		} else {
			console.log(check);
			var index = batchList.indexOf(checkedBatch);
			if (index > -1) {
				batchList.splice(index, 1);
				this.setState(
					(prevState) => ({
						data: batchList
					}),
					() => console.log(sort(this.state.batch).asc())
				);
			}
		}
	}

	getCategory() {
		this.setState({ loading: true });

		const url = 'http://35.247.147.177:3001/api/content/list';

		return Axios.get(url)
			.then((response) => {
				console.log(response.data);
				this.setState({ content: response.data, loading: false });
			})
			.catch((err) => console.log(err));
	}

	handleHide() {
		this.setState({ editMode: false });
	}

	render() {
		const { content, loading, modal } = this.state;
		const {
			contentBody,
			batch,
			contentTitle,
			contentImage,
			subtitle,
			contentType
		} = this.state;
		const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Delete confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleDelete}
					body={'Delete content ' + this.state.contentDesc + ' ?'}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Edit content"
					handleHide={this.handleHide}
					body={
						<Form onSubmit={this.handleUpdate}>
							<Form.Group controlId="formCategory">
								<Form.Label>Content title</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={contentTitle}
									placeholder="Enter content title"
									onChange={this.handleCategory}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitle">
								<Form.Label>Content body</Form.Label>
								<Form.Control
									autoCapitalize="true"
									as="textarea"
									//maxLength={300}
									autoComplete="false"
									type="text"
									value={contentBody}
									placeholder="Enter content body"
									onChange={this.handleSubtitle}
								/>
							</Form.Group>

							<Form.Group>
								<Form.File
									id="exampleFormControlFile1"
									label="Content image"
									onChange={(e) => {
										this.setState({ contentImage: e.target.files[0] });
										console.log(e.target.files[0]);
									}}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Schedule</Form.Label>
								<DateTime
									// timeFormat="hh:mm:ss"
									// dateFormat="DD/MM/YYYY"
									value={this.state.schedulex}
									onChange={(momentz) => {
										console.log(momentz.toDate());
										this.setState({
											schedulex: momentz.toDate()
										});
										// this.setState({
										// 	schedule: momentz.format('DD/MM/YYYY [at] hh:mm:ss')
										// });
										// this.setState({
										// 	schedulex: moment(
										// 		this.state.schedule,
										// 		moment.defaultFormat
										// 	)
										// });
									}}
									inputProps={{
										placeholder: 'Select schedule',
										readOnly: true
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formGridState">
								<Form.Label>Content Type</Form.Label>
								<Form.Control
									as="select"
									value={this.state.contentType}
									onChange={(e) => {
										this.setState({ contentType: e.target.value });
										console.log(e.target.value);
									}}
								>
									<option value="Bootcamp">Bootcamp Information</option>
									<option value="Hiring">Hiring Information</option>
									{/* <option value={2}></option>
									<option value={3}>D</option> */}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="formBasicCheckbox">
								<Form.Check
									inline
									type="checkbox"
									value={1}
									label="Batch 1"
									onChange={this.handleDaySelect}
								/>
								<Form.Check
									inline
									type="checkbox"
									value={2}
									label="Batch 2"
									onChange={this.handleDaySelect}
								/>
								<Form.Check
									inline
									type="checkbox"
									value={3}
									label="Batch 3"
									onChange={this.handleDaySelect}
								/>
							</Form.Group>
							<Button variant="primary" type="submit">
								{this.state.buttonLoading ? 'Updating...' : 'Submit'}
							</Button>
						</Form>
					}
				/>
				<Modal
					scrollable={true}
					show={modal}
					onHide={() => this.setState({ modal: false })}
				>
					<Modal.Header closeButton>
						<Modal.Title
							style={{
								marginTop: '0px',
								marginBottom: '0px',
								color: 'Black',
								fontWeight: 'bold'
							}}
						>
							Add new content
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formCategory">
								<Form.Label>Content title</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									//value={contentTitle}
									placeholder="Enter content title"
									onChange={this.handleCategory}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitle">
								<Form.Label>Content body</Form.Label>
								<Form.Control
									autoCapitalize="true"
									as="textarea"
									maxLength={200}
									autoComplete="false"
									type="text"
									// value={contentBody}
									placeholder="Enter content body"
									onChange={this.handleSubtitle}
								/>
							</Form.Group>

							<Form.Group>
								<Form.File
									id="exampleFormControlFile1"
									label="Content image"
									onChange={(e) => {
										this.setState({ contentImage: e.target.files[0] });
										console.log(e.target.files[0]);
									}}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Schedule</Form.Label>
								<DateTime
									// timeFormat="hh:mm:ss"
									// dateFormat="DD/MM/YYYY"
									//value={this.state.schedule}
									onChange={(momentz) => {
										console.log(momentz.toDate());
										this.setState({
											schedulex: momentz.toDate()
										});
										// this.setState({
										// 	schedule: momentz.format('DD/MM/YYYY [at] hh:mm:ss')
										// });
										// this.setState({
										// 	schedulex: moment(
										// 		this.state.schedule,
										// 		moment.defaultFormat
										// 	)
										// });
									}}
									inputProps={{
										placeholder: 'Select schedule',
										readOnly: true
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formGridState">
								<Form.Label>Content Type</Form.Label>
								<Form.Control
									as="select"
									//value={this.state.contentType}
									onChange={(e) => {
										this.setState({ contentType: e.target.value });
										console.log(e.target.value);
									}}
								>
									<option value="Bootcamp">Bootcamp Information</option>
									<option value="Hiring">Hiring Information</option>
									{/* <option value={2}></option>
									<option value={3}>D</option> */}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="formBasicCheckbox">
								<Form.Check
									inline
									type="checkbox"
									value={1}
									label="Batch 1"
									onChange={this.handleDaySelect}
								/>
								<Form.Check
									inline
									type="checkbox"
									value={2}
									label="Batch 2"
									onChange={this.handleDaySelect}
								/>
								<Form.Check
									inline
									type="checkbox"
									value={3}
									label="Batch 3"
									onChange={this.handleDaySelect}
								/>
							</Form.Group>
							<Button variant="primary" type="submit">
								Submit
							</Button>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={() => this.setState({ modal: false })}>
							Close
						</Button>
						<Button variant="primary" onClick={() => this.setState({ modal: false })}>
							Save Changes
						</Button>
					</Modal.Footer>
				</Modal>
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								category={
									<button
										type="button"
										className="btn btn-labeled btn-primary"
										onClick={() => {
											this.setState({ modal: true });
										}}
									>
										<span className="btn-label">
											<i className="fa fa-plus" />
										</span>{' '}
										Add Content
									</button>
								}
								content={
									<Row>
										{loading && <Col md={12}>Loading, please wait...</Col>}
										{content.map((x, i) => (
											<Col key={i} md={3}>
												<Card
													// style={{ height: '' }}
													//src={x.contentFile.url}
													img={
														<img
															src={x.contentFile.url}
															height={150}
															width="100%"
															style={{
																borderRadius: '10px',
																marginBottom: '10px'
															}}
														/>
													}
													title={x.contentTitle}
													category={
														'Jadwal : ' +
														moment(x.schedule.iso).format('DD/MM/YYYY')
													}
													stats={moment(x.updatedAt).fromNow()}
													statsIcon="pe-7s-clock"
													content={
														<div id="chartActivity" className="">
															{x.contentBody}
														</div>
													}
													legend={
														<div className="legend">
															<Link
																to={`/admin/list/${x.objectId}/category`}
															>
																<button
																	type="button"
																	className="btn btn-circle btn-primary"
																	onClick={() => {
																		console.log(x.schedule);
																	}}
																	style={{ marginRight: '5px' }}
																>
																	<span className="btn-label">
																		<i className="fa fa-eye" />
																	</span>
																</button>
															</Link>
															<button
																type="button"
																className="btn btn-circle btn-danger"
																onClick={() =>
																	this.handleEdit(x.objectId, i)}
															>
																<span className="btn-label">
																	<i className="fa fa-pencil" />
																</span>
															</button>
															<button
																type="button"
																className="btn btn-circle btn-warning"
																style={{ marginLeft: '5px' }}
																onClick={() => {
																	this.setState({
																		deleteMode: true,
																		contentIndex: i,
																		contentDesc: x.contentTitle,
																		contentId: x.objectId
																	});
																}}
															>
																<span className="btn-label">
																	<i className="fa fa-trash" />
																</span>
															</button>
														</div>
													}
												/>
											</Col>
										))}
									</Row>
								}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

function DeleteModal(props) {
	return <div />;
}

export default MasterContent;
