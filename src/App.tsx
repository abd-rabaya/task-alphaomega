import React from "react";

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
const ChartView = React.lazy(() => import("./pages/chartView"));

const App = () => {

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <nav style={{ display: 'flex', margin: '0 16px', padding: '0 16px', border: '5px solid darkslateblue' }}>
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
      </div>
    </BrowserRouter>
  );
}

export default App;