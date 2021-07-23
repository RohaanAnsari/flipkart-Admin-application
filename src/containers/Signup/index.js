import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import { Row, Col, Form, Button, Container } from 'react-bootstrap'
import Input from '../../components/UI/Input'
import { Redirect } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../../actions'


const Signup = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.loading) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    }
  }, [user.loading])

  const userSignUp = (e) => {
    e.preventDefault();
    const user = {
      firstName, lastName, email, password
    }
    dispatch(signup(user));
  }

  if (auth.authenticate) {
    return <Redirect to={`/`} />
  }


  if (user.loading) {
    <p>Loading!!!</p>
  }

  return (
    <div>
      <Layout>
        <Container>
          <Row style={{ marginTop: '50px' }}>
            <Col md={{ span: 6, offset: 3 }}>
              <Form onSubmit={userSignUp}>
                <Row>
                  <Col md={6}>
                    <Input
                      label="First Name"
                      placeholder="First Name"
                      value={firstName}
                      type="text"
                      onChange={(e) => { setFirstName(e.target.value) }}
                    />
                  </Col>
                  <Col md={6}>
                    <Input
                      label="Last Name"
                      placeholder="Last Name"
                      value={lastName}
                      type="text"
                      onChange={(e) => { setLastName(e.target.value) }}
                    />
                  </Col>
                </Row>
                <Input
                  label="Email address"
                  placeholder="Enter email"
                  value={email}
                  type="email"
                  onChange={(e) => { setEmail(e.target.value) }}
                />

                <Input
                  label="Password"
                  placeholder="Password"
                  value={password}
                  type="password"
                  onChange={(e) => { setPassword(e.target.value) }}
                />

                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    </div>
  )
}

export default Signup