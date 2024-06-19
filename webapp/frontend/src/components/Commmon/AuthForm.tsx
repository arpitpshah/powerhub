import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface AuthFormProps {
  title: string;
  fields: Array<{
    id: string;
    label: string;
    name: string;
    type: string;
    autoComplete: string;
    required: boolean;
  }>;
  onSubmit: (data: FormData) => void;
  isLoggedIn: boolean; // New prop to indicate whether the user is logged in
  onLogout: () => void;
  user?: { name: string };
  showSuccessMessage?: boolean;
}

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          style: { color: 'grey' },
        },
        InputProps: {
          style: { color: 'grey', borderColor: '#1c1c1c' },
        },
        sx: { '& fieldset': { background: '#1c1c1c', color: '#ffffff' } },
      },
    },
    MuiButton: {
      defaultProps: {
        style: { backgroundColor: '#143d60', color: '#ffffff' },
      },
    },
    MuiLink: {
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiTypography: {
      defaultProps: {
        style: { color: 'grey' },
      },
    },
  },
  palette: {
    background: {
      default: '#1a1a1a',
    },
  },
});

const AuthForm: React.FC<AuthFormProps> = ({ title, fields, onSubmit, isLoggedIn, onLogout, user,showSuccessMessage  }) => {
  const linkText = title === 'Sign in' ? "Don't have an account? Sign Up" : 'Already have an account? Sign in';

  const formik = useFormik({
    initialValues: fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {} as Record<string, string>), // Explicitly type the initialValues object
    validationSchema: yup.object().shape({
      // Define validation rules for each field
      ...fields.reduce((acc, field) => {
        acc[field.name] = field.required
          ? field.type === 'email'
            ? yup.string().email('Enter a valid email address').required(`${field.label} is required`) as yup.StringSchema<string>
            : field.type === 'password'
            ? yup.string().min(6, 'Password must be at least 8 characters long').required(`${field.label} is required`) as yup.StringSchema<string>
            : yup.string().required(`${field.label} is required`) as yup.StringSchema<string>
          : yup.string(); // If not required, no additional validation
        return acc;
      }, {} as Record<string, yup.StringSchema<string | undefined>>),
    }),
    onSubmit: (values) => {
      const data = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'string') {
          data.append(key, value);
        }
      });
      onSubmit(data);
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',height:`calc(100vh - 68.5px)`, justifyContent:'center'}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: 8,
            backgroundColor: '#28282B',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {showSuccessMessage && (
            <Typography variant="body2" sx={{ color: '#4caf50', mt: 2 }}>
              Successfully registered! You can now log in.
            </Typography>
          )}
          {isLoggedIn && user && (
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              {user.name}
            </Typography>
          )}
          {!isLoggedIn && (
            <Avatar sx={{ m: 1, bgcolor: '#143d60' }}>
              <LockOutlinedIcon sx={{fill:'#ffffff'}}/>
            </Avatar>
          )}
          <Typography component="h1" variant="h5" style={{color:'#ffffff'}}>
            {title}
          </Typography>
          {isLoggedIn && (
            <Button variant="contained" fullWidth onClick={onLogout} sx={{ mt: 2, backgroundColor: '#ff5252' }}>
              Logout
            </Button>
          )}
          {!isLoggedIn && (
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
              {fields.map((field) => (
                <TextField
                key={field.id}
                margin="normal"
                required={field.required}
                fullWidth
                id={field.id}
                label={field.label}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                InputLabelProps={{ style: { color: 'grey' } }}
                InputProps={{ style: { color: 'grey', borderColor: '#1c1c1c' } }}
                sx={{ '& fieldset': { color: '#ffffff', borderColor: '#1c1c1c' } }}
                error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
                helperText={formik.touched[field.name] && formik.errors[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field.name]}
              />
              ))}
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                {title}
              </Button>
              <Grid container>
                <Grid item>
                  <Link href={title === 'Sign in' ? '/signup' : '/login'} variant="body2" sx={{ color: 'grey' }}>
                    {linkText}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AuthForm;
