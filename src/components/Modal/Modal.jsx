import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Modal extends Component {
	state = {};
	render() {
		return (
			<div>
				<div className="container">
					<h2>Bootstrap 3.3.7 - Modal Demo</h2>
					<div className="row text-center">
						<h3>The Basic Modal</h3>
						<a
							href="#"
							className="btn btn-lg btn-success"
							data-toggle="modal"
							data-target="#basicModal"
						>
							Click to open Modal
						</a>
					</div>
					<hr />
					<div className="row text-center">
						<h3>The Large Modal</h3>
						<a
							href="#"
							className="btn btn-lg btn-primary"
							data-toggle="modal"
							data-target="#largeModal"
						>
							Click to open Modal
						</a>
					</div>
					<hr />
					<div className="row text-center">
						<h3>The Small Modal</h3>
						<a
							href="#"
							className="btn btn-lg btn-danger"
							data-toggle="modal"
							data-target="#smallModal"
						>
							Click to open Modal
						</a>
					</div>
				</div>
				<div
					className="modal fade"
					id="basicModal"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="basicModal"
					aria-hidden="true"
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-hidden="true"
								>
									×
								</button>
								<h4 className="modal-title" id="myModalLabel">
									Basic Modal
								</h4>
							</div>
							<div className="modal-body">
								<h3>Modal Body</h3>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-default"
									data-dismiss="modal"
								>
									Close
								</button>
								<button type="button" className="btn btn-primary">
									Save changes
								</button>
							</div>
						</div>
					</div>
				</div>
				<div
					className="modal fade"
					id="largeModal"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="largeModal"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-lg">
						<div className="modal-content">
							<div className="modal-header">
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-hidden="true"
								>
									×
								</button>
								<h4 className="modal-title" id="myModalLabel">
									Large Modal
								</h4>
							</div>
							<div className="modal-body">
								<h3>Modal Body</h3>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-default"
									data-dismiss="modal"
								>
									Close
								</button>
								<button type="button" className="btn btn-primary">
									Save changes
								</button>
							</div>
						</div>
					</div>
				</div>
				<div
					className="modal fade"
					id="smallModal"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="smallModal"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-sm">
						<div className="modal-content">
							<div className="modal-header">
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									aria-hidden="true"
								>
									×
								</button>
								<h4 className="modal-title" id="myModalLabel">
									Small Modal
								</h4>
							</div>
							<div className="modal-body">
								<h3>Modal Body</h3>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-default"
									data-dismiss="modal"
								>
									Close
								</button>
								<button type="button" className="btn btn-primary">
									Save changes
								</button>
							</div>
						</div>
					</div>
				</div>
				<p className="p">
					Demo by Syed Fazle Rahman.{' '}
					<a
						href="http://www.sitepoint.com/understanding-bootstrap-modals/"
						target="_blank"
					>
						See article
					</a>.
				</p>
			</div>
		);
	}
}

export default Modal;
