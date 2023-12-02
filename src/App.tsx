import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const ChartView = React.lazy(() => import("./pages/chartView"));
const PeopleView = React.lazy(() => import("./pages/peopleView"));
const Layout = React.lazy(() => import("./components/navbar/mainNavbar"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ChartView />
              </Suspense>
            } />
            <Route path="/people_view" element={
              <Suspense fallback={<div>Loading...</div>}>
                <PeopleView />
              </Suspense>

            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
