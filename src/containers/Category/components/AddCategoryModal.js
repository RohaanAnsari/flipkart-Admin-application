import React from 'react';
import Input from '../../../components/UI/Input';
import CustomModal from '../../../components/UI/Modal';

const AddCategoryModal = (props) => {
  const {
    show,
    handleClose,
    modalTitle,
    categoryName,
    setCategoryName,
    parentCategoryId,
    setParentCategoryId,
    categoryList,
    handleCategoryImage,
    onSubmit
  } = props;

  return (
    <CustomModal
      show={show}
      handleClose={handleClose}
      modalTitle={modalTitle}
      onSubmit={onSubmit}
    >
      <Input
        value={categoryName}
        placeholder={`Category Name`}
        onChange={(e) => setCategoryName(e.target.value)}
      />

      <select
        className="form-control"
        value={parentCategoryId}
        onChange={e => setParentCategoryId(e.target.value)}
      >
        <option>Select Category</option>
        {
          categoryList.map(option =>
            <option key={option.value} value={option.value}> {option.name} </option>
          )
        }
      </select>

      <input
        style={{ marginTop: '15px' }}
        type='file'
        name='categoryImage'
        onChange={handleCategoryImage}
      />
    </CustomModal >
  )
}

export default AddCategoryModal;