import React, {useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { Signup } from "./Signup";
import DevelopersLandingPage from "./components/developers_landing/DevelopersLandingPage";
import SuggestionPage from "./components/suggestion_page/SuggestionPage";
import FloorPlanPage from "./components/floor_plans/FloorPlan";

function App() {
  const [returnedData, setReturnedData] = useState(['hello']);

  const fetchData = async () => {
    const newData = await fetch ('/hello', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => res.json())
    console.log(newData);
    setReturnedData(newData.result)
  }

  return (
    <Router>
    <div className = "App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/developers-landing-page" element={<DevelopersLandingPage />} />
        <Route path="/suggestion-page" element={<SuggestionPage />} />
        <Route path="/floor-plan-page" element={<FloorPlanPage />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
