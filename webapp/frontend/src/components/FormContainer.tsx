import React, { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default FormContainer;