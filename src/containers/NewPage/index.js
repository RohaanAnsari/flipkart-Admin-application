import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/layout'
import Input from '../../components/UI/Input';
import CustomModal from '../../components/UI/Modal';
import linearCategories from '../../helpers/linearCategories';
import { createPage } from '../../actions';

function NewPage(props) {
  const [createModal, setCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const category = useSelector(state => state.category);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('');
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [catid, setCatid] = useState('');
  const page = useSelector(state => state.page)

  const dispatch = useDispatch();

  useEffect(() => {
    setCategories(linearCategories(category.categories));
  }, [category]);

  useEffect(() => {
    if (!page.loading) {
      setCreateModal(false);
      setTitle('');
      setCategoryId('');
      setCatid('');
      setDesc('');
      setProducts([]);
      setBanners([]);
    }
  }, [page]);

  const onCategoryChange = (e) => {
    const category = categories.find(category => category.name == e.target.value);
    setCategoryId(e.target.value);//"category name ex: `Electronics`"
    setCatid(category.value);//E "category value which is the mongodb id ex:`6048a1e23efb7c0360e6a167`"
    setType(category.type); //"category type.In my case it is undefined bcoz i didn't pre-define it"
  }

  const submitPageForm = (e) => {
    if (title === '') {
      alert('Title is required');
      setCreateModal(false);
      return;
    }

    const form = new FormData();
    form.append('title', title);
    form.append('description', desc);
    form.append('category', catid);
    form.append('type', type);
    banners.forEach((banner, index) => {
      form.append('banners', banner);
    });

    products.forEach((product, index) => {
      form.append('products', product);
    });

    dispatch(createPage(form));
    console.log({ title, desc, categoryId, type, banners, products })
  }

  const handleBannersImages = (e) => {
    console.log(e)
    setBanners([...banners, e.target.files[0]]);
  }

  const handleProductsImages = (e) => {
    console.log(e)
    setProducts([...products, e.target.files[0]]);
  }

  const renderCreatePageModal = () => {
    return (
      <CustomModal
        show={createModal}
        modalTitle={'Create new page'}
        handleClose={() => setCreateModal(false)}
        onSubmit={submitPageForm}
      >
        <Container>
          <Row>
            <Col>
              <select
                className="form-control form-control-sm"
                value={categoryId}
                onChange={onCategoryChange}
              >
                <option value=''>Select Category</option>
                {
                  categories.map(cat =>
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  )}
              </select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                className="form-control-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={'Page Title'}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Input
                className="form-control-sm"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={'Page Description'}
              />
            </Col>
          </Row>
          {
            banners.length > 0 ?
              banners.map((banner, index) =>
                <Row key={index}>
                  <Col>{banner.name}</Col>
                </Row>
              ) : null
          }
          <Row>
            <Col>
              <input
                type='file'
                name='banners'
                onChange={handleBannersImages}
              />
            </Col>
          </Row>
          {
            products.length > 0 ?
              products.map((product, index) =>
                <Row key={index}>
                  <Col>{product.name}</Col>
                </Row>
              ) : null
          }
          <Row>
            <Col>
              <input
                type='file'
                name='products'
                onChange={handleProductsImages}
              />
            </Col>
          </Row>

        </Container>
      </CustomModal >

    )
  }

  return (
    <Layout sidebar>
      {
        page.loading ?
          <>
            <p style={{ color: '#fff' }}>Creating Page...Wait a moment</p>
          </>
          :
          <>
            {renderCreatePageModal()}
            <button onClick={(e) => setCreateModal(true)}>
              Create Page
            </button>
          </>
      }
    </Layout>
  )
}

export default NewPage
