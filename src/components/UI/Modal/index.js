import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import './styles.css'

const CustomModal = (props) => {
  return (
    <div>
      <Modal style={{ overflowX: 'hidden' }} size={props.size} show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.children}
        </Modal.Body>
        <Modal.Footer>
          {
            props.buttons ? props.buttons.map((btn, index) =>
              <Button key={index} variant={btn.color} onClick={btn.onClick}>
                {btn.label}
              </Button>
            ) :
              <Button variant="primary" onClick={props.onSubmit}>
                Done
              </Button>
          }
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CustomModal;
