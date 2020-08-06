import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../utils';
import AdminLayout from 'layouts/Admin';

const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to /signin page
		<Route
			exact
			{...rest}
			render={(props) => (isLogin() ? <AdminLayout {...props} /> : <Redirect to="/login" />)}
		/>
		// <Route
		//   {...rest}
		//   render={(props) => (isLogin() ? <Component {...props} /> : <Component {...props} />)}
		// />
	);
};

export default PrivateRoute;
