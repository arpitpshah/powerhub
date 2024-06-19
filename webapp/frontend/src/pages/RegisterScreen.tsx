// SignUp.tsx
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../services/api';
import { signupSuccess } from '../redux/actions/authActions';
import AuthForm from '../components/Commmon/AuthForm';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const handleSignUp = async (data: FormData) => {
    try {
      const result = await signup(Object.fromEntries(data.entries()));
      if (result.user && typeof result.user.firstName === 'string' && typeof result.user.lastName === 'string') {
        const initials = (result.user.firstName[0] ?? '') + (result.user.lastName[0] ?? '');
        setShowSuccessMessage(true);
        dispatch(signupSuccess({ name: `${result.user.firstName} ${result.user.lastName}`, initials }));
        setTimeout(() => {
          setShowSuccessMessage(false); 
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signUpFields = [
    { id: 'firstName', label: 'First Name', name: 'firstName', type: 'text', autoComplete: 'given-name', required: true },
    { id: 'lastName', label: 'Last Name', name: 'lastName', type: 'text', autoComplete: 'family-name', required: true },
    { id: 'emailId', label: 'Email Address', name: 'emailId', type: 'email', autoComplete: 'email', required: true },
    { id: 'password', label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password', required: true },
  ];

  return (
    <AuthForm
      title="Sign up"
      fields={signUpFields}
      onSubmit={handleSignUp}
      isLoggedIn={false}
      onLogout={() => {}}
      showSuccessMessage={showSuccessMessage}
    />
  );
}
