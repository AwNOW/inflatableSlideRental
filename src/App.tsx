import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Form from "./components/FormComponent/FormComponent";
import Regulations from "./components/RegulationsComponent/Regulations";
import Home from "./components/HomeComponent/Home";
import Assortment from "./components/AssortmentComponent/Assortment";

const App: React.FC = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={"/cennik"} element={<Assortment />} />
        <Route path={"/rezerwacja"} element={<Form />} />
        <Route path={"/regulamin"} element={<Regulations />} />
        <Route path="*" element={<div>This page doesn't exist!</div>} />
      </Routes>
    </div>
  );
};

export default App;
