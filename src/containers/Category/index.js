import React, { useEffect, useState } from 'react';
import './styles.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCategory,
  getAllCategory,
  updateCategories,
  deleteCategories as deleteCategoriesAction
} from '../../actions';
import Layout from '../../components/layout';
import Input from '../../components/UI/Input';
import CustomModal from '../../components/UI/Modal';
import PreLoader from '../PreLoader';
import CheckboxTree from 'react-checkbox-tree';
import {
  IoIosCheckbox,
  IoIosCheckboxOutline,
  IoIosArrowForward,
  IoIosArrowDown,
  IoIosAdd,
  IoIosTrash,
  IoIosCloudUpload
} from 'react-icons/io'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import UpdateCategoriesModal from './components/UpdateCategoriesModal';
import AddCategoryModal from './components/AddCategoryModal';
// import DeleteCategoryModal from './components/DeleteCategoryModal';

const Category = (props) => {

  const category = useSelector(state => state.category);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);


  useEffect(() => {
    if (!category.loading) {
      setShow(false);
    }
  }, [category.loading])


  const handleShow = () => setShow(true);
  const handleClose = () => {
    const form = new FormData();

    if (categoryName == '') {
      alert('Category name is required');
      setShow(false);
      return;
    }

    form.append('name', categoryName);
    form.append('parentId', parentCategoryId);
    form.append('categoryImage', categoryImage);
    dispatch(addCategory(form));
    setCategoryName('');
    setShow(false);
  }

  const updateCheckedAndExpandedCategories = () => {
    const categories = createCategoryList(category.categories);
    const checkedArray = [];
    const expandedArray = [];

    checked.length > 0 && checked.forEach((categoryId, index) => {
      const category = categories.find((category, _index) => categoryId == category.value);
      category && checkedArray.push(category);
    });

    expanded.length > 0 && expanded.forEach((categoryId, index) => {
      const category = categories.find((category, _index) => categoryId == category.value);
      category && expandedArray.push(category);
    });

    setCheckedArray(checkedArray);
    setExpandedArray(expandedArray);
  }

  const updateCategory = () => {
    updateCheckedAndExpandedCategories();
    setUpdateCategoryModal(true);
  }

  const handleCategoryInput = (key, value, index, type) => {
    if (type === 'checked') {
      const updatedCheckedArray = checkedArray.map((item, _index) => index === _index ? { ...item, [key]: value } : item);
      setCheckedArray(updatedCheckedArray);
    } else if (type === 'expanded') {
      const updatedExpandedArray = expandedArray.map((item, _index) => index === _index ? { ...item, [key]: value } : item);
      setCheckedArray(updatedExpandedArray);
    }
  }

  const [categoryName, setCategoryName] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState('')
  const [categoryImage, setCategoryImage] = useState('')

  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push(
        {
          label: category.name,
          value: category._id,
          children: category.children.length && renderCategories(category.children),
          // type: category.type
        }
      )
    }
    return myCategories;
  }

  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({
        value: category._id,
        name: category.name,
        parentId: category.parentId,
        type: category.type
      });
      if (category.children.length > 0) {
        createCategoryList(category.children, options)
      }
    }
    return options;
  }

  const handleCategoryImage = (e) => {
    setCategoryImage(e.target.files[0]);
  }

  const updateCategoriesForm = () => {
    const form = new FormData();
    expandedArray.forEach((item, index) => {
      form.append('_id', item.value);
      form.append('name', item.name);
      form.append('parentId', item.parentId ? item.parentId : '');
      form.append('type', item.type);
    });
    checkedArray.forEach((item, index) => {
      form.append('_id', item.value);
      form.append('name', item.name);
      form.append('parentId', item.parentId ? item.parentId : '');
      form.append('type', item.type);
    });

    dispatch(updateCategories(form));
    setUpdateCategoryModal(false);
  }

  const deleteCategory = () => {
    updateCheckedAndExpandedCategories();
    setDeleteCategoryModal(true)
  }

  const deleteCategories = () => {
    const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }));
    const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }));
    const idsArray = expandedIdsArray.concat(checkedIdsArray);

    if (checkedIdsArray.length > 0) {
      dispatch(deleteCategoriesAction(checkedIdsArray))
        .then(result => {
          if (result) {
            dispatch(getAllCategory())
            setDeleteCategoryModal(false)
          }
        });
    }
    setDeleteCategoryModal(false);
  }

  const renderDeleteCategoryModal = () => {
    return (
      <CustomModal
        modalTitle='Confirm'
        show={deleteCategoryModal}
        handleClose={() => setDeleteCategoryModal(false)}
        buttons={[
          {
            label: 'No',
            color: 'primary',
            onClick: () => {
              setDeleteCategoryModal(false);
            }
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

  const categoryList = createCategoryList(category.categories);
  return (
    <Layout sidebar>
      <Container>
        <Row>
          {
            category.loading
              ?
              <>
                <PreLoader />
              </>
              :
              <>
                <Col md={12}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                    <h3>Category</h3>
                    <div className='actionBtnContainer'>
                      <span>Actions:</span>
                      <button
                        className="myBtn"
                        onClick={handleShow}>
                        <IoIosAdd />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={deleteCategory}
                        className="myBtn"
                      >
                        <IoIosTrash />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={updateCategory}
                        className="myBtn"
                      >
                        <IoIosCloudUpload />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </Col>
                <Col md={12} style={{ color: 'white' }}>
                  <CheckboxTree
                    nodes={renderCategories(category.categories)}
                    checked={checked}
                    expanded={expanded}
                    onCheck={checked => setChecked(checked)}
                    onExpand={expanded => setExpanded(expanded)}
                    icons={{
                      check: <IoIosCheckbox />,
                      uncheck: <IoIosCheckboxOutline />,
                      halfCheck: <IoIosCheckboxOutline />,
                      expandClose: <IoIosArrowForward />,
                      expandOpen: <IoIosArrowDown />,
                      parentOpen: <span style={{ display: "none" }} />,
                      parentClose: <span style={{ display: "none" }} />,
                      leaf: <span style={{ display: "none" }} />,
                    }}
                  />

                </Col>
              </>
          }
        </Row>
      </Container>

      {/* ****************************** Modal for CREATING Cateogry **********************/}
      <AddCategoryModal
        show={show}
        handleClose={() => setShow(false)}
        onSubmit={handleClose}
        modalTitle={'Add New Category'}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        parentCategoryId={parentCategoryId}
        setParentCategoryId={setParentCategoryId}
        categoryList={categoryList}
        handleCategoryImage={handleCategoryImage}
      />

      {/* ****************************** Modal for UPDATING Cateogry **********************/}
      <UpdateCategoriesModal
        show={updateCategoryModal}
        handleClose={() => setUpdateCategoryModal(false)}
        onSubmit={updateCategoriesForm}
        modalTitle={`Update Categories`}
        size="lg"
        expandedArray={expandedArray}
        checkedArray={checkedArray}
        handleCategoryInput={handleCategoryInput}
        categoryList={categoryList}
      />


      {/* ****************************** Modal for DELETING Cateogry **********************/}
      {renderDeleteCategoryModal()}
      {/* <DeleteCategoryModal
        modalTitle='Confirm'
        show={deleteCategoryModal}
        handleClose={setDeleteCategoryModal(false)}
        deleteCategories={deleteCategories}
        expandedArray={expandedArray}
        checkedArray={checkedArray}
      /> */}

    </Layout >
  )
}

export default Category
