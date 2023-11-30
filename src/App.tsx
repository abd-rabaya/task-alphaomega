import React from "react";

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
const ChartView = React.lazy(() => import("./pages/chartView"));

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">ChartView</Link>
          </li>
          <li>
            <Link to="/people_view">peopleView</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<ChartView />} />
          <Route path="/about" element={<div>aaa</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;