import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/* Components */
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Container from './components/layouts/Container';

/* Pages */
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Home from './components/pages/Home';
import Message from './components/layouts/Message';

/* Contexts */
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
          <Message/>
          <Container>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        <Footer />
      </UserProvider>
    </Router>
    
  );
}

export default App;
