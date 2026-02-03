import { RouterProvider } from 'react-router-dom';
import ChatBot from './components/ChatBot';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import { router } from './router';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ChatBot />
    </AuthProvider>
  );
}

export default App;
