import { Link } from 'react-router-dom'

const NavBar = ({ user, handleLogOut }) => {
  let userOptions

  if (user) {
    userOptions = (
      <nav>
        <h3>Welcome {user.name}!</h3>
        <Link to="/courses">Courses</Link>
        <Link onClick={handleLogOut} to="/">
          Sign Out
        </Link>
      </nav>
    )
  }

  const publicOptions = (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Sign In</Link>
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
