import React, { Component } from 'react';
import axios from 'axios';
import { Form, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { login } from 'utils';
import { useHistory } from 'react-router';
import '../assets/css/my.css';
import Parse from 'parse';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hello: '',
			username: '',
			password: '',
			loading: false,
			error: null
		};

		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidMount() {}

	handleLogin(e) {
		e.preventDefault();
		this.setState({ loading: true });
		const { username, password } = this.state;
		const User = new Parse.User();
		const query = new Parse.Query(User);

		Parse.User
			.logIn(username, password)
			.then((x) => {
				if (x.get('roles') !== 'admin') {
					alert('Selain admin dilarang masuk');
					Parse.User.logOut();
					window.location.reload();
					return;
				}
				console.log('masuk');
				login();

				// if(x.get('roles') !== 'admin') {

				// }
				// login();

				this.setState({ loading: false });
				this.props.history.push('/admin/register');
			})
			.catch((err) => {
				console.log(err);
				this.setState({ error: err.message, loading: false });
			});
	}

	// getHelloWorld() {
	// 	const url = 'http://35.247.147.177:3001/hello';
	// 	axios.get(url).then(({ data }) => {
	// 		this.setState({ hello: data });
	// 	});
	// }
	render() {
		const { hello, loading, error } = this.state;

		return (
			<div className="containerz">
				<div className="login">
					<p style={{ textAlign: 'center', fontWeight: 'bolder' }}>
						{error ? error + ' Try again' : 'Login First'}
					</p>
					<Form onSubmit={this.handleLogin}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter username"
								onChange={(e) => {
									this.setState({ username: e.target.value });
								}}
							/>
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								onChange={(e) => {
									this.setState({ password: e.target.value });
								}}
							/>
						</Form.Group>
						<Button variant="primary" type="submit">
							{loading ? 'Please wait...' : 'Login'}
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default Login;
