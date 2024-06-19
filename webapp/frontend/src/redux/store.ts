// store.ts
import { createStore, combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import complaintReducer from './reducers/complaintReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  complaints: complaintReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer
);

export default store;
