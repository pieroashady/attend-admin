import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class ModalHandler extends Component {
	render() {
		return (
			<Modal
				size={this.props.size}
				scrollable={true}
				show={this.props.show}
				onHide={this.props.handleHide}
			>
				<Modal.Header closeButton>
					<Modal.Title
						style={{
							marginTop: '0px',
							marginBottom: '0px',
							color: 'Black',
							fontWeight: 'bold'
						}}
					>
						{this.props.title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>{this.props.body}</Modal.Body>
				{this.props.footer ? (
					<Modal.Footer>
						<Button variant="secondary" onClick={this.props.handleHide}>
							Cancel
						</Button>
						<Button variant="primary" onClick={this.props.handleSave}>
							{this.props.loading ? (
								'Please wait...'
							) : (
								`${this.props.saveText || 'Yes'}`
							)}
						</Button>
					</Modal.Footer>
				) : (
					''
				)}
			</Modal>
		);
	}
}

export default ModalHandler;
