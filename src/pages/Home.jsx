import { useNavigate } from 'react-router-dom'

const Home = () => {
  let navigate = useNavigate()

  return (
    <div className="">
      <h1>Welcome to WhiteBoard e-Class</h1>
      <section className="welcome-signin">
        <button onClick={() => navigate('/user/login')}>Sign In</button> 
      </section>
    </div>
  )
}

export default Home
