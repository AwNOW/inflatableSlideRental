import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import FormikContactComponent from "./components/ContactComponent/FormikContactComponent";
import RegulationsComponent from "./components/RegulationsComponent/RegulationsComponent";
import BubblesComponent from "./components/BubblesComponent/BubblesComponent";
import HomeComponent from "./components/HomeComponent/HomeComponent";

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="App-header"></header>

      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path={"/cennik"} element={<BubblesComponent bubbles={[]} />} />
        <Route path={"/kontakt"} element={<div>KONTAKT</div>} />
        <Route path={"/rezerwacja"} element={<FormikContactComponent />} />
        <Route path={"/regulamin"} element={<RegulationsComponent />} />
        <Route path="*" element={<div>This page doesn't exist!</div>} />
      </Routes>
    </div>
  );
};

export default App;
