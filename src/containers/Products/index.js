import React from 'react'
import { useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, deleteProductById } from '../../actions'
import Layout from '../../components/layout'
import Input from '../../components/UI/Input'
import CustomModal from '../../components/UI/Modal'
import { generatePublicUrl } from '../../urlConfig'
import { IoIosInformationCircle } from "react-icons/io";
import { IoTrash } from "react-icons/io5";

import './styles.css'

const Products = () => {

  // Add Product Modal (State Variables) 
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productPictures, setProductPictures] = useState([]);

  // Show Product Details Modal (State Variables) 
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null)
  console.log(productDetailsModal)

  const category = useSelector(state => state.category)
  const product = useSelector(state => state.product)
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);

  const onSubmit = () => {
    const form = new FormData();
    form.append('name', name);
    form.append('quantity', quantity);
    form.append('price', price);
    form.append('description', description);
    form.append('category', categoryId);
    for (let pic of productPictures) {
      form.append('productPicture', pic);
    }
    dispatch(addProduct(form));
    setShow(false);
    setName("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setProductPictures([]);
  }

  const handleClose = () => {
    setShow(false);
    setName("");
    setQuantity("");
    setPrice("");
    setDescription("");
    setCategoryId("");
    setProductPictures([]);
  }



  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options)
      }
    }
    // console.log(`create Category List ... .. . . . . . ${JSON.stringify(options)}`);
    return options;
  }


  const handleProductPicture = (e) => {
    setProductPictures([
      ...productPictures,
      e.target.files[0]
    ]);
  }

  // console.log(productPictures);

  const renderProducts = () => {
    return (
      <Table style={{ fontSize: 13, cursor: 'pointer' }} variant="dark" responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            product.products.length > 0 ?
              product.products.map((product, index) =>
                <tr
                  key={product._id}
                // onClick={() => showProductDetailsModal(product)}
                >
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <button
                      onClick={() => showProductDetailsModal(product)}
                      style={{
                        padding: '0px 10px',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'black',
                        background: 'transparent'
                      }}
                    >
                      <IoIosInformationCircle
                        style={{ fontSize: '20px', color: 'white' }}
                      />

                    </button>
                    <button
                      style={{
                        padding: '0px 10px',
                        marginLeft: '6px',
                        border: 'none',
                        borderRadius: '5px',
                        color: 'black',
                        background: 'transparent'
                      }}
                      onClick={() => {
                        setShow(false);
                        setProductDetailsModal(false);
                        const payload = {
                          productId: product._id,
                        };
                        dispatch(deleteProductById(payload))
                      }}
                    >
                      <IoTrash
                        style={{ fontSize: '20px', color: 'white' }}
                      />
                    </button>
                  </td>
                </tr>
              )
              : null
          }
        </tbody>
      </Table>
    )
  }

  const renderAddProductModal = () => {
    return (
      <CustomModal
        style={{ overflow: 'hidden' }}
        show={show}
        handleClose={handleClose}
        onSubmit={onSubmit}
        modalTitle={`Add new Product`}
      >
        <Input
          value={name}
          placeholder={`Product Name`}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          value={quantity}
          placeholder={`Quantity`}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <Input
          value={price}
          placeholder={`Price`}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          value={description}
          placeholder={`Description`}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          style={{ marginTop: '25px', marginBottom: '5px' }}
          className="form-control"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
        >
          <option>Select Category</option>
          {
            createCategoryList(category.categories)
              .map(option =>
                <option key={option.value} value={option.value}> {option.name} </option>
              )
          }
        </select>

        {/* {productPictures.length > 0 ?
          productPictures.map((pic, index) => <div key={index}> {pic.name} </div>) : null
        } */}

        <input
          style={{ marginTop: '15px' }}
          type="file" name="productPicture"
          onChange={handleProductPicture}
        />

      </CustomModal>
    )
  }

  const handleCloseProductDetailsModal = () => {
    setProductDetailsModal(false);
  }

  const showProductDetailsModal = (product) => {
    setProductDetails(product)
    setProductDetailsModal(true);
    // console.log(product);
  }

  const renderProductDetailsModal = () => {
    if (!productDetails) {
      return null;
    }
    return (
      <CustomModal
        style={{ overflow: 'hidden' }}
        size="lg"
        show={productDetailsModal}
        handleClose={handleCloseProductDetailsModal}
        onSubmit={handleCloseProductDetailsModal}
        modalTitle={`Product Details`}
      >
        <Row>

          <Col md='6' >
            <label className='key'>Name</label>
            <p className='value'>{productDetails.name}</p>
          </Col>

          <Col md='6' >
            <label className='key'>Price</label>
            <p className='value'>{productDetails.price}</p>
          </Col>

          <Col md='6' >
            <label className='key'>Category</label>
            <p className='value'>{productDetails.category.name}</p>
          </Col>

          <Col md='6' >
            <label className='key'>Quantity</label>
            <p className='value'>{productDetails.quantity}</p>
          </Col>

          <Col md='12' >
            <label className='key'>Description</label>
            <p className='value'>{productDetails.description}</p>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <label className='key'>Product Pictures</label>
            <div style={{ display: 'flex' }}>
              {productDetails.productPictures.map(picture =>
                <div className="productImgContainer">
                  <img src={generatePublicUrl(picture.img)} />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </CustomModal>
    )
  }

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
              <h3>Products</h3>
              <button style={{
                padding: '5px 30px',
                marginTop: '3px',
                border: 'none',
                borderRadius: '5px',
                color: 'black',
                background: '#eeeeee'
              }}
                onClick={handleShow}
              >
                Add
              </button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginTop: '10px' }}>
            {renderProducts()}
          </Col>
        </Row>
      </Container>
      {renderAddProductModal()}
      {renderProductDetailsModal()}
    </Layout>
  )
}

export default Products
