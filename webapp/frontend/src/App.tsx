// App.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import store from './redux/store';
import Header from './components/Header/Header';
import Routes from './components/Routes/Routes';
import { initializeAuth } from './services/authService';

const theme = createTheme();

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth();
      setIsInitialized(true);
      console.log('Redux store state:', store.getState());
    };

    initialize();
  }, []);

  if (!isInitialized) {
    // You can render a loading spinner or some other indicator here
    return null;
  }

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
            <Container>
              <Routes />
            </Container>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
