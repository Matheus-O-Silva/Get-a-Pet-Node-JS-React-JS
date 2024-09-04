import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/* Components */
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Container from './components/layouts/Container';

/* Pages */
import Login from './components/pages/Login';
import Profile from './components/pages/User/Profile';
import Register from './components/pages/Register';
import Home from './components/pages/Home';
import Message from './components/layouts/Message';
import AddPet from './components/pages/Pet/AddPet';
import MyPets from './components/pages/Pet/MyPets';
import EditPet from './components/pages/Pet/EditPet';
import PetDetails from './components/pages/Pet/PetDetails';
import MyAdoptions from './components/pages/Pet/MyAdoptions';

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
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/pet/add" element={<AddPet />} />
            <Route path="/pets/mypets" element={<MyPets />} />
            <Route path="/pet/edit/:id" element={<EditPet />} />
            <Route path="/pet/myadoptions" element={<MyAdoptions />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/" element={<Home />} />
            </Routes>
          </Container>
      </UserProvider>
      <Footer />
    </Router>
  );
}

export default App;
