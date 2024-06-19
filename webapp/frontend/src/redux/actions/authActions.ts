import { User } from '../../types/users';
import { LOGIN_SUCCESS, LOGOUT, SIGNUP_SUCCESS, UPDATE_USER_PROFILE } from '../constants/userConstant';

export const loginSuccess = (user: { name: string; initials: string,userId: string, role:string }) => ({
    type: LOGIN_SUCCESS,
    payload: user,
  });
  

export const logout = () => ({
  type: LOGOUT as typeof LOGOUT,
});

export const signupSuccess = (user: User) => ({
  type: SIGNUP_SUCCESS as typeof SIGNUP_SUCCESS,
  payload: user,
});

export const updateUserProfile = (user: User) => ({
  type: UPDATE_USER_PROFILE,
  payload: user,
});