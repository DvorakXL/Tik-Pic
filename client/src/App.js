import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import { useContext } from "react"
import CreatePost from "./pages/CreatePost"
import Login from "./pages/Login"
import Posts from "./pages/Posts"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Profile from "./pages/Profile"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import icon from './assets/icon.png'
import { UserContext } from './context/UserContext'

function App() {
  const { currentUser } = useContext(UserContext)

  const handleLogout = () => {
    localStorage.removeItem('tokens')
    window.location.reload()
  }

  return (
    <div className="bg-light">
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt="Logo"
              src={icon}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Tik-Pic
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              {currentUser?.uid ?
                <>
                  <Nav.Link href="/upload">Upload</Nav.Link>
                  <Nav.Link href="/profile">{currentUser?.username}</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Sign Out</Nav.Link>
                </> :
                <Nav.Link href="/login">Sign In</Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<NotFound />} />
          {currentUser?.uid ?
            <>
              <Route path="/" element={<Posts />} />
              <Route path="/upload" element={<CreatePost />} />
              <Route path="/profile" element={<Profile />} />
            </> :
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Login />} />
            </>
          }
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
