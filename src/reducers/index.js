import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import productReducer from './product.reducer';
import orderReducer from './order.reducer';
import categoryReducer from './category.reducer'
import pageReducer from './page.reducer'

const rootreducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  category: categoryReducer,
  product: productReducer,
  order: orderReducer,
  page: pageReducer,
})

export default rootreducer;