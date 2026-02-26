import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './app/store';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Main App Component
 * Sets up Redux, Router, and OAuth providers
 * Note: Replace YOUR_GOOGLE_CLIENT_ID with actual Google OAuth client ID
 */
function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
