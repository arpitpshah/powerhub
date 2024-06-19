import { Reducer } from 'redux';
import { loginSuccess, logout, signupSuccess } from '../actions/authActions';
import { User } from '../../types/users';
import { LOGIN_SUCCESS, LOGOUT, SIGNUP_SUCCESS, UPDATE_USER_PROFILE } from '../constants/userConstant';

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const storedUser = localStorage.getItem('user');
const initialState: AuthState = {
  isLoggedIn: !!storedUser,
  user: storedUser ? JSON.parse(storedUser) : null,
};

type AuthAction = ReturnType<typeof loginSuccess | typeof logout | typeof signupSuccess>;

const authReducer: Reducer<AuthState, AuthAction> = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_SUCCESS:
        return {
          ...state,
          isLoggedIn: true,
          user: (action as ReturnType<typeof loginSuccess | typeof signupSuccess>).payload as User,
        };
      case SIGNUP_SUCCESS:
        return {
          ...state,
          isLoggedIn: false,
          user: (action as ReturnType<typeof loginSuccess | typeof signupSuccess>).payload as User,
        };
      case LOGOUT:
        return {
          ...state,
          isLoggedIn: false,
          user: null,
        };
      case UPDATE_USER_PROFILE:
        return {
          ...state,
          user: action.payload as User,
        };
      default:
        return state;
    }
  };

export default authReducer;
