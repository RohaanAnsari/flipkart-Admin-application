import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import PrivateRoute from './components/HOC/PrivateRoute';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategory, getInitialData, isUserLoggedIn } from './actions';
import Products from './containers/Products';
import Orders from './containers/Orders';
import Category from './containers/Category';
import NewPage from './containers/NewPage';

function App() {

  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
    if (auth.authenticate) {
      dispatch(getInitialData());
      console.log(getInitialData())
    }
  }, [auth.authenticate]);

  return (
    <div className="App">
      <Router>
        <Switch>

          <PrivateRoute path="/" exact component={Home} />
          <PrivateRoute path="/page" component={NewPage} />
          <PrivateRoute path="/category" component={Category} />
          <PrivateRoute path="/products" component={Products} />
          <PrivateRoute path="/orders" component={Orders} />

          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
