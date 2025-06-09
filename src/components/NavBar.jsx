import { Link } from 'react-router-dom'
import '../Styles/App.css'

const NavBar = ({ user, handleLogOut }) => {
  let userOptions

  if (user) {
    userOptions = (
      <nav>
        <div className="nav-left">
          <h3>Welcome {user.name}!</h3>
        </div>
        <div className="nav-right">
        <Link to="/courses">Courses</Link>
        <Link onClick={handleLogOut} to="/">
          Sign Out
        </Link>
        </div>
      </nav>
    )
  }

  const publicOptions = (
    <nav>
      <div className='nav-left'></div>
      <div className='nav-right'>
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/user/register">Register</Link>
      <Link to="/user/login">Sign In</Link>
      </div>
    </nav>
  )

  return (
    <header>
      <Link to="/">
        <img className="logo" src="src/images/WhiteBoard Logo.png" alt="logo" />
      </Link>
      {user ? userOptions : publicOptions}
    </header>
  )
}

export default NavBar
