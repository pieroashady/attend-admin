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
import { Container, Row, Col, Table, Tooltip, Button, OverlayTrigger } from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';
import { thArray, tdArray } from 'variables/Variables.jsx';
import { Link } from 'react-router-dom';

class Trainee extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reco: [],
			trainee: [],
			loading: false
		};
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	handleAddQuestion(a, b) {
		let x = a + b;
		console.log('clicked', x);
		this.setState({ loading: true });
	}

	baseUrl(route) {
		return `http://localhost:5000/api/${route}`;
	}

	getData() {
		return axios.get(this.baseUrl('trainee/list')).then((response) => {
			console.log(response.data);
			this.setState({ reco: response.data, trainee: response.data.results });
		});
	}

	render() {
		const { reco, loading, trainee } = this.state;
		console.log(reco.length);
		const tooltip = <Tooltip id="button-tooltip">Simple tooltip</Tooltip>;
		return (
			<div className="content">
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								category={
									<Link to={`/trainee/add`}>
										<button
											type="button"
											className="btn btn-labeled btn-primary"
											onClick={() => {
												this.handleAddQuestion(1, 2);
											}}
										>
											<span className="btn-label">
												<i className="fa fa-plus" />
											</span>{' '}
											{loading ? 'Loading...' : 'Add Trainee'}
										</button>
									</Link>
								}
								ctTableFullWidth
								ctTableResponsive
								content={
									<Table striped hover>
										<thead>
											<tr>
												<th>NO</th>
												<th>NAMA</th>
												<th>USERNAME</th>
												<th>BATCH</th>
												<th>TEMPAT LAHIR</th>
												<th>TANGGAL LAHIR</th>
												<th>PHONE</th>
												<th>ACTION</th>
											</tr>
										</thead>
										<tbody key={1}>
											{reco.map((prop, key) => (
												<tr key={key}>
													<td>{key + 1}</td>
													<td>{prop.fullname}</td>
													<td>{prop.username}</td>
													<td>{prop.batch}</td>
													<td>{prop.placeOfBirth}</td>
													<td>{prop.dateOfBirth}</td>
													<td>{prop.phoneNumber}</td>
													<td>
														<Link
															to={`/admin/trainee/${prop.objectId}/view`}
														>
															<button
																type="button"
																className="btn btn-primary btn-circle"
															>
																<i className="fa fa-eye" />
															</button>
														</Link>{' '}
														<Link
															to={`/admin/trainee/${prop.objectId}/edit`}
														>
															<button
																type="button"
																className="btn btn-warning btn-circle"
															>
																<i className="fa fa-pencil" />
															</button>
														</Link>{' '}
														<Link
															to={`/admin/trainee/${prop.objectId}/delete`}
														>
															<button
																type="button"
																className="btn btn-danger btn-circle"
															>
																<i className="fa fa-trash" />
															</button>
														</Link>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Trainee;
