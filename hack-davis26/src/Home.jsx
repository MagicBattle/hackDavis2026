import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Facts from './Facts'

function Home() {
  return (
    <>
      <Header />
      <div className="facts-container">
        <Facts paragraph="Red 40" />
        <Facts paragraph="Yellow 5" />
        <Facts paragraph="Blue 1" />
      </div>
      <Link to="/scan">Scan a Label</Link>
      <Footer />
    </>
  );
}

export default Home
