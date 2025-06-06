import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwt_token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('jwt_token');
      return <Navigate to="/" replace />;
    }
    
    return children;
  } catch (error) {
    localStorage.removeItem('jwt_token');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;