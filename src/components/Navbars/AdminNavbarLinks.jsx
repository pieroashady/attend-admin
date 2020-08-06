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
import { NavItem, Nav, NavDropdown, MenuItem, Navbar } from 'react-bootstrap';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import Axios from 'axios';
import { baseurl } from 'utils/baseurl';
import Parse from 'parse';

class AdminNavbarLinks extends Component {
	constructor(props) {
		super(props);

		this.handleLogout = this.handleLogout.bind(this);
	}

	handleLogout() {
		Parse.User.logOut().then(() => {
			localStorage.removeItem('sessionToken');
			localStorage.removeItem('jwt');
			localStorage.removeItem('userInfo');
			return createHashHistory().push('/login');
		});
	}

	render() {
		const notification = (
			<div>
				<i className="fa fa-globe" />
				<b className="caret" />
				<span className="notification">5</span>
				<p className="hidden-lg hidden-md">Notification</p>
			</div>
		);
		return (
			<Nav className="pull-right">
				{/* <Nav.Link style={{ color: 'black' }} href="#home">
					{this.props.username}
				</Nav.Link>
				<Nav.Link style={{ color: 'black' }} href="#link">
					Account
				</Nav.Link>
				<Nav.Link style={{ color: 'black' }} href="#link">
					Logout
				</Nav.Link> */}
				<Nav.Item as="li">
					<Nav.Link eventKey="linkz" href="/home" style={{ textAlign: 'center' }}>
						{this.props.username}
					</Nav.Link>
				</Nav.Item>
				<Nav.Item as="li">
					<Nav.Link
						eventKey="link-2"
						style={{ textAlign: 'center' }}
						onClick={this.handleLogout}
					>
						Logout
					</Nav.Link>
				</Nav.Item>
			</Nav>
			// <div className="navbar-collapse collapse">
			// 	<div>
			// 		<ul className="nav navbar-nav navbar-right">
			// 			<li role="presentation" className="">
			// 				<a href="#" role="button">
			// 					{this.props.username}
			// 				</a>
			// 			</li>
			// 			<li role="presentation" className="">
			// 				<a href="#" role="button">
			// 					Account
			// 				</a>
			// 			</li>
			// 			<li role="presentation" className="" onClick={this.handleLogout}>
			// 				<a href="#" role="button">
			// 					Log out
			// 				</a>
			// 			</li>
			// 		</ul>
			// 	</div>
			// </div>
		);
	}
}

export default AdminNavbarLinks;
