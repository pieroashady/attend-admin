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

class MasterCategory extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quizCategory: '',
			subtitle: '',
			desc: '',
			schedule: moment().format('DD/MM/YYYY [at] hh:mm:ss'),
			timeInMinutes: 0,
			batch: [],
			category: [],
			categoryIndex: 0,
			loading: false,
			modal: false,
			editMode: false,
			deleteMode: false,
			categoryDesc: '',
			categoryId: '',
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
			quizCategory,
			subtitle,
			desc,
			schedule,
			timeInMinutes,
			batch,
			schedulex
		} = this.state;
		const data = {
			quizCategory,
			subtitle,
			desc,
			schedule: moment(schedulex, moment.defaultFormat).toDate(),
			timeInMinutes: parseInt(timeInMinutes),
			batch: sort(batch).asc()
		};
		console.log(this.state.schedulex.toDate());
		console.log(moment(schedule, moment.defaultFormat).toDate());

		Axios.post(baseurl('category/add'), data)
			.then((x) => {
				console.log(x.data);
				this.setState({
					category: this.state.category.concat(x.data.x),
					modal: false,
					batch: []
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
		this.setState({ quizCategory: e.target.value });
	}

	handleSubtitle(e) {
		this.setState({ subtitle: e.target.value });
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

	handleEdit(id, idx) {
		const data = { categoryId: id };
		Axios.post(baseurl('category/id'), data)
			.then(({ data }) => {
				console.log(data);
				this.setState(
					{
						editMode: true,
						quizCategory: data.category,
						categoryIndex: idx,
						desc: data.description,
						subtitle: data.subtitle,
						schedulex: moment(data.schedule.iso).format('DD/MM/YYYY HH:mm:ss'),
						batch: data.batch,
						timeInMinutes: data.timeInMinutes,
						categoryId: id
					},
					() => console.log('batch', this.state.batch)
				);
			})
			.catch((err) => console.log(err));
	}

	handleUpdate(e) {
		e.preventDefault();
		const {
			quizCategory,
			subtitle,
			desc,
			schedule,
			timeInMinutes,
			batch,
			schedulex
		} = this.state;
		const data = {
			categoryId: this.state.categoryId,
			category: quizCategory,
			subtitle,
			desc,
			schedule: moment(schedule, moment.defaultFormat),
			timeInMinutes: parseInt(timeInMinutes),
			batch: sort(batch).asc()
		};

		Axios.post(baseurl('category/update'), data)
			.then((x) => {
				console.log('berhasil', x);
				const newCategory = [ ...this.state.category ];
				newCategory.splice(this.state.categoryIndex, 1, x.data);
				//window.location.reload(false);
				this.setState({
					category: newCategory,
					editMode: false
				});
			})
			.catch((err) => console.log(err));
	}

	handleDelete() {
		console.log(this.state.categoryId);
		const data = { categoryId: this.state.categoryId };
		this.setState({ buttonLoading: true });

		Axios.post(baseurl('category/delete'), data)
			.then(({ data }) => {
				const newCategory = [ ...this.state.category ];
				newCategory.splice(this.state.categoryIndex, 1);
				this.setState({
					category: newCategory,
					deleteMode: false
				});
			})
			.catch((err) => console.log(err));
	}

	getCategory() {
		this.setState({ loading: true });

		const url = 'http://35.247.147.177:3001/api/category/list';

		return Axios.get(url)
			.then((response) => {
				this.setState({ category: response.data, loading: false });
			})
			.catch((err) => console.log(err));
	}

	handleHide() {
		this.setState({ editMode: false });
	}

	render() {
		const { category, loading, modal } = this.state;
		const { quizCategory, batch, desc, timeInMinutes, subtitle, schedule } = this.state;
		console.log(batch);
		const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Delete confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleDelete}
					body={'Delete category ' + this.state.categoryDesc + ' ?'}
				/>
				<ModalHandler
					show={this.state.editMode}
					title="Edit category"
					handleHide={this.handleHide}
					body={
						<Form onSubmit={this.handleUpdate}>
							<Form.Group controlId="formCategory">
								<Form.Label>Quiz category</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={quizCategory}
									placeholder="Enter category"
									onChange={this.handleCategory}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitle">
								<Form.Label>Subtitle</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={subtitle}
									placeholder="Enter subtitle"
									onChange={this.handleSubtitle}
								/>
							</Form.Group>

							<Form.Group controlId="formDescription">
								<Form.Label>Description</Form.Label>
								<Form.Control
									as="textarea"
									autoCapitalize="true"
									autoComplete="false"
									value={desc}
									placeholder="Enter description"
									rows={5}
									onChange={this.handleDesc}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Schedule</Form.Label>
								<DateTime
									// dateFormat="hh:mm:ss"
									// timeFormat="DD/MM/YYYY"
									value={this.state.schedulex}
									onChange={(momentz) => {
										console.log(momentz.toDate());
										this.setState({
											schedulex: momentz.toDate()
										});
									}}
									inputProps={{
										placeholder: 'Select schedule',
										readOnly: true
									}}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Waktu pengerjaan (menit)</Form.Label>
								<Form.Control
									autoComplete="false"
									type="number"
									value={timeInMinutes}
									placeholder="Waktu pengerjaan"
									onChange={this.handleTime}
								/>
							</Form.Group>

							<Form.Group controlId="formBasicCheckbox">
								<Form.Check
									inline
									type="checkbox"
									checked={batch.includes(1) ? 'true' : 'false'}
									value={1}
									label="Batch 1"
									onChange={this.handleDaySelect}
								/>
								<Form.Check
									inline
									type="checkbox"
									checked={batch.includes(2) ? 'true' : 'false'}
									value={2}
									label="Batch 2"
									onChange={this.handleDaySelect}
								/>
								<Form.Check
									inline
									type="checkbox"
									checked={batch.includes(3) ? 'true' : 'false'}
									value={3}
									label="Batch 3"
									onChange={this.handleDaySelect}
								/>
							</Form.Group>
							<Button variant="primary" type="submit">
								Submit
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
							Add Quiz Category
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formCategory">
								<Form.Label>Quiz category</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={quizCategory}
									placeholder="Enter category"
									onChange={this.handleCategory}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitle">
								<Form.Label>Subtitle</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={subtitle}
									placeholder="Enter subtitle"
									onChange={this.handleSubtitle}
								/>
							</Form.Group>

							<Form.Group controlId="formDescription">
								<Form.Label>Description</Form.Label>
								<Form.Control
									as="textarea"
									autoCapitalize="true"
									autoComplete="false"
									value={desc}
									placeholder="Enter description"
									rows={5}
									onChange={this.handleDesc}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Schedule</Form.Label>
								<DateTime
									value={this.state.schedule}
									onChange={(momentz) => {
										this.setState({
											schedule: momentz.format('DD/MM/YYYY [at] hh:mm:ss')
										});
										this.setState({
											schedulex: moment(
												this.state.schedule,
												moment.defaultFormat
											)
										});
									}}
									inputProps={{
										placeholder: 'Select schedule',
										readOnly: true
									}}
								/>
							</Form.Group>

							<Form.Group>
								<Form.Label>Waktu pengerjaan (menit)</Form.Label>
								<Form.Control
									autoComplete="false"
									type="number"
									value={timeInMinutes}
									placeholder="Waktu pengerjaan"
									onChange={this.handleTime}
								/>
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
										Add Category
									</button>
								}
								content={
									<Row>
										{loading && <Col md={12}>Loading, please wait...</Col>}
										{category.map((x, i) => (
											<Col key={i} md={3}>
												<Card
													// style={{ height: '' }}
													title={x.category}
													category={
														'Jadwal : ' +
														moment(x.schedule.iso).format('DD/MM/YYYY')
													}
													stats={moment(x.updatedAt).fromNow()}
													statsIcon="pe-7s-clock"
													content={
														<div id="chartActivity" className="">
															{x.description}
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
																		categoryIndex: i,
																		categoryDesc: x.category,
																		categoryId: x.objectId
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

export default MasterCategory;
