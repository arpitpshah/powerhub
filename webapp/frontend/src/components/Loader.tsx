import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader: React.FC = () => {
  return (
    <CircularProgress
      style={{ width: '100px', height: '100px', margin: 'auto', display: 'block' }}
    />
  );
};

export default Loader;