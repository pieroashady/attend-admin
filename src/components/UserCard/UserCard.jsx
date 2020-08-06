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

export class UserCard extends Component {
	render() {
		return (
			<div
				className="card card-user"
				style={{
					borderRadius: '20px 20px 20px 20px',
					borderColor: `${this.props.out === 1 ? '#0390fc' : '#fc032d'}`
				}}
			>
				<div className="image" style={{ borderRadius: '20px 20px 0px 0px' }}>
					{/* <img src={this.props.bgImage} alt="..." /> */}
					{this.props.bgImage}
				</div>
				<div className="content">
					<div className="author">
						<a href="#">
							<img className="avatar border-gray" src={this.props.avatar} alt="..." />
							<h4 className="title">
								{this.props.name}
								<br />
								<small>{this.props.userName}</small>
							</h4>
						</a>
					</div>
					<p className="description text-center">{this.props.description}</p>
				</div>
				<hr />
				<div className="text-center">
					{this.props.status == 3 ? this.props.socials : null}
				</div>
			</div>
		);
	}
}

export default UserCard;
