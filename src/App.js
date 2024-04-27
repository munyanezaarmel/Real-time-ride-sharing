import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MapRoute from "./components/MapRoute";
import { Loader } from "@googlemaps/js-api-loader";
import Header from "./components/Header";
import Footer from "./components/Footer";
function App() {
  const [mapLoader, setMapLoader] = useState(false);
  useEffect(() => {
    const options = {
      apiKey: process.env.REACT_APP_API_KEY,
      version: "weekly",
      libraries: ["geometry"],
    };
    new Loader(options)
      .load()
      .then(() => {
        setMapLoader(true);
      })
      .catch((error) => {
        console.error("Something ain't working; try again later.", error);
      });
  }, []);
  return (
    <div >
      <Header/>
      {!mapLoader ? <div>Loading...</div> : <MapRoute />}
      <Footer/>
    </div>
  );
}
export default App;