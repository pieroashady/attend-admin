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
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

import AdminLayout from 'layouts/Admin.jsx';
import PrivateRoute from 'views/PrivateRoute';
import Login from 'views/Login';
import Modal from 'components/Modal/Modal';
import Parse from 'parse';
import * as env from './env';

Parse.initialize(env.APPLICATION_ID, env.JAVASCRIPT_KEY, env.MASTER_KEY);
Parse.serverURL = env.SERVER_URL;

ReactDOM.render(
	<BrowserRouter>
		<Switch>
			<PrivateRoute path="/admin" />
			<Route path="/login" component={Login} />
			<Redirect from="/" to="/admin/register" />
			<Route exact path="/modal" component={Modal} />
		</Switch>
	</BrowserRouter>,
	document.getElementById('root')
);
