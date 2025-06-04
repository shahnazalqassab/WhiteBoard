import { useNavigate } from 'react-router-dom'

const Home = () => {
  let navigate = useNavigate()

  return (
    <div className="">
      <h1>Welcome to WhiteBoard e-Class</h1>
      <section className="">
        <button onClick={() => navigate('/login')}>Sign In</button> 
      </section>
    </div>
  )
}

export default Home
