import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import Facts from "./Facts.jsx"
import "./Facts.css"


function App() {


  return (
    <>
    <Header/>

    <div className="facts-container">
      <Facts paragraph="Red 40"/>
      <Facts paragraph="Yellow 5"/>
      <Facts paragraph="Blue 1"/>
    </div>

    <Footer/>

    </>
  );
}

export default App
