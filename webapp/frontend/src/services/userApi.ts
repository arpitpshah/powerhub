import { handleJsonResponse } from "./api";

const apiUrl = process.env.REACT_APP_API_URL;


export const updateUser = async (editedUser: any) => {
    try {
      const response = await fetch(`${apiUrl}api/users/admin/${editedUser.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          role: editedUser.role,
          userId:editedUser.userId,
          password:editedUser.password,
          emailId:editedUser.emailId,
        }),
      });

      await handleJsonResponse(response);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  export const deleteUser = async (userId: any) => {
    try {
      const response = await fetch(`${apiUrl}api/users/admin/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      await handleJsonResponse(response);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };