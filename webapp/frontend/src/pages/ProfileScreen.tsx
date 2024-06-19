import { Avatar, Button, Card, Container, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save';
import { updateUserProfile } from "../redux/actions/authActions";
import { updateUser } from "../services/userApi";

interface UserData {
  emailId: string;
  firstName: string;
  lastName: string;
  password?:string;
  role?: string;
  userId?: string;
}

interface User {
  name:string;
  initials:string;
  userData: UserData;
  role?: string;
}

interface RootState {
  auth: {
    isLoggedIn: boolean;
    user: User | null;
  };
}


const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const [firstName, setFirstName] = useState(user?.userData.firstName);
  const [lastName, setLastName] = useState(user?.userData.lastName);
  const [emailId, setEmailId] = useState(user?.userData.emailId);
  

  const handleEditToggle = async() => {
    if (editMode) {

      const updatedUserData = {
        ...user?.userData, 
        firstName: firstName || user?.userData.firstName, 
        lastName: lastName || user?.userData.lastName, 
        emailId: emailId || user?.userData.emailId, 
        password: user?.userData.password,
        role: user?.userData.role,
        userId: user?.userData.userId
      };
      

      const updatedUser = {
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        initials: `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`,
        userData: updatedUserData,
      };
      dispatch(updateUserProfile(updatedUser));
      try {
        await updateUser(updatedUserData);
        dispatch(updateUserProfile(updatedUser));
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
    setEditMode(!editMode);
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{
        width: '100%',
        maxWidth: 500,
        boxShadow: 2,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
        bgcolor: 'background.paper'
      }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            bgcolor: 'rgb(20, 61, 96)'
          }}
          alt="Profile Picture"
        >
          { `${firstName?.charAt(0).toUpperCase() || ''}${lastName?.charAt(0).toUpperCase() || ''}`}
        </Avatar>
        {editMode ? (
          <>
          <TextField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            variant="outlined"
            margin="dense"
            fullWidth
          />
          <TextField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            variant="outlined"
            margin="dense"
            fullWidth
            sx={{ mt: 1 }}
          />
          </>
        ) : (
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
            {firstName} {lastName}
          </Typography>
        )}
        {editMode ? (
          <TextField
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            variant="outlined"
            margin="dense"
            fullWidth
            sx={{ mt: 1 }}
          />
        ) : (
          <Typography variant="body1" color="textSecondary">
            Email: {emailId}
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={editMode ? <SaveIcon /> : <EditIcon />}
          onClick={handleEditToggle}
          sx={{
            mt: 2,
            borderRadius: 20,
            textTransform: 'none',
            bgcolor:  'rgb(20, 61, 96)',
            '&:hover': {
              bgcolor: 'rgb(20, 61, 96)',
            },
          }}
        >
          {editMode ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </Card>
    </Container>
  );
}

export default ProfilePage;
