import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <AuthProvider> {/* Wrap the application with AuthProvider */}
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
