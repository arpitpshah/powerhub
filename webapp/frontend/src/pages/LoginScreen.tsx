// LoginScreen.tsx
import { useDispatch } from 'react-redux';
import { login } from '../services/api';
import { loginSuccess } from '../redux/actions/authActions';
import AuthForm from '../components/Commmon/AuthForm';

export default function LoginScreen() {
  const dispatch = useDispatch();

  const handleSignIn = async (data: FormData) => {
    try {
      const result = await login(Object.fromEntries(data.entries()));

      if (result.user && typeof result.user.firstName === 'string' && typeof result.user.lastName === 'string') {
        const initials = (result.user.firstName[0] ?? '') + (result.user.lastName[0] ?? '');
        const user = {
          name:`${result.user.firstName} ${result.user.lastName}`,
          initials:initials,
          userId:result.user.userId,
          role:result.user.role,
          userData:{
            firstName:result.user.firstName,
            lastName:result.user.lastName,
            emailId:result.user.emailId,
            role:result.user.role,
            userId:result.user.userId
          }
          
        }
        dispatch(loginSuccess(user));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signInFields = [
    { id: 'emailId', label: 'Email Address', name: 'emailId', type: 'email', autoComplete: 'email', required: true },
    { id: 'password', label: 'Password', name: 'password', type: 'password', autoComplete: 'current-password', required: true },
  ];

  return <AuthForm title="Sign in" fields={signInFields} onSubmit={handleSignIn} isLoggedIn={false} onLogout={() => {}} />;
}
