import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../../src/assets/images/Electricity2.png';

const Logo = () => (
  <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
    <img src={logoImage} alt="Logo" style={{ marginRight: '10px', height: '50px' }} />
  </Box>
);

export default Logo;
