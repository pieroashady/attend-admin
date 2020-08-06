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
import { baseurl } from 'utils/baseurl';

class UserScore extends Component {
	constructor(props) {
		super(props);
		this.state = {
			score: [],
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

	getData() {
		const userId = this.props.match.params.id;
		const data = { userId: userId };

		return axios.post(baseurl('score/user'), data).then((response) => {
			console.log(response.data);
			this.setState({ score: response.data });
		});
	}

	render() {
		const { score, loading } = this.state;
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
											{loading ? 'Loading...' : 'Add'}
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
												<th>QUIZ</th>
												<th>SCORE</th>
												<th>STATUS</th>
											</tr>
										</thead>
										<tbody key={1}>
											{score.length < 1 ? (
												<tr>
													<td colSpan={6} style={{ textAlign: 'center' }}>
														NO DATA FOUND
													</td>
												</tr>
											) : (
												score.map((prop, key) => (
													<tr key={key}>
														<td>{key + 1}</td>
														<td>{prop.userId.fullname}</td>
														<td>{prop.categoryId.category}</td>
														<td>{prop.score}</td>
														<td
															style={{
																color: `${prop.passed
																	? 'blue'
																	: 'red'}`
															}}
														>
															{prop.passed ? 'LULUS' : 'TIDAK LULUS'}
														</td>
													</tr>
												))
											)}
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

export default UserScore;
