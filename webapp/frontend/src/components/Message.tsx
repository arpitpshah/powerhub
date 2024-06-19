import React from 'react';
import Alert from '@mui/material/Alert';

interface MessageProps {
  variant: 'success' | 'info' | 'warning' | 'error';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant, children }) => {
  return (
    <Alert severity={variant}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;