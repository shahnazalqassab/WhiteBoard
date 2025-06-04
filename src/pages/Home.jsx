import { useNavigate } from 'react-router-dom'

const Home = () => {
  let navigate = useNavigate()

  return (
    <div className="">
      <h>Welcome to WhiteBoard e-Class</h>
      {/* <section className="">
        <button onClick={() => navigate('/signin')}>
          Click Here To Get Started
        </button> 
      </section> */}

    </div>
  )
}

export default Home
