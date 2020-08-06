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
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import AdminNavbarLinks from './AdminNavbarLinks.jsx';
import Axios from 'axios';
import Parse from 'parse';

class Header extends Component {
	constructor(props) {
		super(props);
		this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
		this.state = {
			sidebarExists: false,
			username: ''
		};
	}
	componentDidMount() {
		console.log('mount');
		const data = {
			token: localStorage.getItem('sessionToken')
		};
		const user = Parse.User.current();
		this.setState({ username: user.get('username') });
		// return Axios.post('http://35.247.147.177:3001/api/user', data).then((x) => {
		// 	this.setState({ username: x.data.username });
		// });
	}
	mobileSidebarToggle(e) {
		if (this.state.sidebarExists === false) {
			this.setState({
				sidebarExists: true
			});
		}
		e.preventDefault();
		document.documentElement.classList.toggle('nav-open');
		var node = document.createElement('div');
		node.id = 'bodyClick';
		node.onclick = function() {
			this.parentElement.removeChild(this);
			document.documentElement.classList.toggle('nav-open');
		};
		document.body.appendChild(node);
	}
	render() {
		return (
			<Navbar
				expand="lg"
				variant="default"
				style={{ paddingBottom: '0px', paddingTop: '0px', height: '62px' }}
			>
				<Container fluid>
					<Navbar.Brand
						style={{ paddingTop: '10px', paddingBottom: '10px', color: 'black' }}
						href="#"
					>
						{this.props.brandText}
					</Navbar.Brand>
					<Navbar.Toggle
						aria-controls="basic-navbar-nav"
						onClick={this.mobileSidebarToggle}
					>
						<i className="fa fa-bars" aria-hidden="true" />
					</Navbar.Toggle>
					<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
						<AdminNavbarLinks username={this.state.username} />
					</Navbar.Collapse>
				</Container>
			</Navbar>
			// <nav className="navbar navbar-default">
			// 	<Container fluid>
			// 		<div className="navbar-header">
			// 			{/* <Navbar.Brand>
			// 				<a href="#pablo">{this.props.brandText}</a>
			// 			</Navbar.Brand> */}
			// 			<a href="#" className="navbar-brand">
			// 				{this.props.brandText}
			// 			</a>
			// 			<button
			// 				type="button"
			// 				className="navbar-toggle collapsed"
			// 				onClick={this.mobileSidebarToggle}
			// 			>
			// 				<span className="sr-only">Toggle navigation</span>
			// 				<span className="icon-bar" />
			// 				<span className="icon-bar" />
			// 				<span className="icon-bar" />
			// 			</button>
			// 			{/* <Navbar.Toggle onClick={this.mobileSidebarToggle} /> */}
			// 		</div>
			// 		<Navbar.Collapse>
			// 			<AdminNavbarLinks username={this.state.username} />
			// 		</Navbar.Collapse>
			// 	</Container>
			// </nav>
		);
	}
}

export default Header;
