import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Main App Component
 * Sets up Redux and Router providers
 */
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
