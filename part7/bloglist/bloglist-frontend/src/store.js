import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';
import allUsersReducer from './reducers/allUsersReducer';

const reducer = combineReducers({
	blogs: blogReducer,
	notification: notificationReducer,
	user: userReducer,
	allUsers: allUsersReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
