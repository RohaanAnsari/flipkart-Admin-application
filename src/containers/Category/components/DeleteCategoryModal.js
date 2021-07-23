import React from 'react';
import Input from '../../../components/UI/Input';
import CustomModal from '../../../components/UI/Modal';
// import { Col, Row } from 'react-bootstrap';

const DeleteCategoryModal = (props) => {
  const {
    modalTitle,
    show,
    handleClose,
    deleteCategories,
    expandedArray,
    checkedArray,
  } = props;
  return (
    <CustomModal
      modalTitle={modalTitle}
      show={show}
      handleClose={handleClose}
      buttons={[
        {
          label: 'No',
          color: 'primary',
          onClick: () => { handleClose() }
        },
        {
          label: 'Yes',
          color: 'danger',
          onClick: () => { deleteCategories() }
        },
      ]}
    >
      <h5>Expanded</h5>
      {expandedArray.map((item, index) => <span key={index}>{item.name}</span>)}
      <h5>Checked</h5>
      {checkedArray.map((item, index) => <span key={index}>{item.name}</span>)}
    </CustomModal>
  )
}

export default DeleteCategoryModal;