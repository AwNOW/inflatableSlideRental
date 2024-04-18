import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import FormComponent from "./components/FormComponent/FormComponent";
import RegulationsComponent from "./components/RegulationsComponent/RegulationsComponent";
import HomeComponent from "./components/HomeComponent/HomeComponent";
import AssortmentComponent from "./components/AssortmentComponent/AssortmentComponent";
import ContactDetailsComponent from "./components/ContactDetailsComponent/ContactDetailsComponent";

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="App-header"></header>

      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path={"/cennik"} element={<AssortmentComponent />} />
        <Route path={"/kontakt"} element={<ContactDetailsComponent />} />
        <Route path={"/rezerwacja"} element={<FormComponent />} />
        <Route path={"/regulamin"} element={<RegulationsComponent />} />
        <Route path="*" element={<div>This page doesn't exist!</div>} />
      </Routes>
    </div>
  );
};

export default App;
