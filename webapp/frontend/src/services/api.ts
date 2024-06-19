const apiUrl = process.env.REACT_APP_API_URL;

export const handleJsonResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

export const signup = async (userData: any) => {
  try {
    const response = await fetch(`${apiUrl}auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return handleJsonResponse(response);
  } catch (error) {
    throw new Error('Signup failed');
  }
};

export const login = async (credentials: any) => {

    try {
        const response = await fetch(`${apiUrl}auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
    
        const data = await handleJsonResponse(response);
    
        if (response.ok) {
          const { token, user } = data;
          localStorage.setItem('token', token);
          return { user };
        } else {
          console.error('Error during login:', data.message);
          throw new Error(data.message);
        }
      } catch (error) {
        throw new Error('Login failed');
      }
};

