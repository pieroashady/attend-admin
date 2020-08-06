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

import RegisterStaff from 'views/Admin/RegisterStaff';
import EksporData from 'views/Admin/EksporData';
import ChangeRequest from 'views/Admin/ChangeRequest';
import SetTimer from 'views/Admin/SetTimer';
import Dashboard from 'views/Dashboard';

const dashboardRoutes = [
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'pe-7s-graph',
		component: Dashboard,
		layout: '/admin'
	},
	{
		path: '/register',
		name: 'Register Karyawan',
		icon: 'pe-7s-users',
		component: RegisterStaff,
		layout: '/admin'
	},
	{
		path: '/ekspor',
		name: 'Ekspor Data',
		icon: 'pe-7s-repeat',
		component: EksporData,
		layout: '/admin'
	},
	{
		path: '/request',
		name: 'Change Request',
		icon: 'pe-7s-back-2',
		component: ChangeRequest,
		layout: '/admin'
	},
	{
		path: '/setting',
		name: 'Setting',
		icon: 'pe-7s-settings',
		component: SetTimer,
		layout: '/admin'
	}
	// {
	// 	path: '/early',
	// 	name: 'Early request',
	// 	icon: 'pe-7s-repeat',
	// 	component: EarlyLeave,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/late',
	// 	name: 'Late request',
	// 	icon: 'pe-7s-next',
	// 	component: Late,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/overtime',
	// 	name: 'Overtime',
	// 	icon: 'pe-7s-moon',
	// 	component: Overtime,
	// 	layout: '/admin'
	// },
	// {
	// 	path: '/izin',
	// 	name: 'Izin',
	// 	icon: 'pe-7s-flag',
	// 	component: UserProfile,
	// 	layout: '/admin'
	// }
];

export default dashboardRoutes;
