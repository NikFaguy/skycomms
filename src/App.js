import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUserContext } from './hooks/useUserContext';

//pages and components
import Accueil from './pages/Accueil'
import Navbar from './components/Navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import ResetPassword from './pages/resetPassword';
import NewPassword from './pages/newPassword';
import Profile from './pages/Profile';
import CreateDiscussion from './pages/createDiscussion';
import DiscussionPage from './pages/DiscussionPage';
import UserHistoryPage from './pages/UserHistoryPage';
import Search from './pages/Search';
import ErrorPage from './pages/ErrorPage';


function App() {
  const { user } = useUserContext()
  return (
    <div className="App">
      <BrowserRouter>

        <Navbar />

        <div className='pages'>

          <Routes>
            <Route
              path="/"
              element={<Accueil />}
            />

            <Route
              path="/user/login"
              //!user : ces pages ne sont pas accessibles si on est déjà connecté
              element={!user ? <Login /> : <Navigate to="/" />}
            />

            <Route
              path="/user/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />

            <Route
              path="/user/resetPassword"
              element={!user ? <ResetPassword /> : <Navigate to="/" />}
            />
            <Route path='/resetPassword/:id/:token'
              element={!user ? <NewPassword /> : <Navigate to="/" />}
            />

            <Route path='/discussion/search' element={<Search />} />

            <Route
              path="/discussion/create"
              //user : ces pages sont accessibles seulement lorsque l'on est connecté
              element={user ? <CreateDiscussion /> : <Navigate to="/" />}
            />

            <Route
              path="/discussion/:id"
              element={<DiscussionPage />}
            />

            <Route
              path="/user/profile"
              element={user ? <Profile /> : <Navigate to="/" />}
            />

            <Route
              path="/user/user_history/:id"
              element={user && user.user.isAdmin ? <UserHistoryPage /> : <Navigate to="/" />}
            />

            <Route
              path="*"
              element={<ErrorPage errorType="404" />}
            />

          </Routes>

        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
