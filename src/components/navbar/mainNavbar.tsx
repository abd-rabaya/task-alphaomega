import React from 'react';
import { To, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  height: 100vh
`;

const StyledNav = styled.nav`
  flex: 0 0 auto; 
  width: 200px; 
  padding: 16px;
  background-color: darkslateblue;
  color: white;
  box-sizing: border-box; 

  button {
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px; 
    transition: color 0.3s ease;

    &:hover {
      color: lightblue;
    }
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 16px;
  box-sizing: border-box; 
`;

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (to: To) => {
    navigate(to);
  };

  return (
    <StyledNav>
      <button onClick={() => handleNavigation('/')}>ChartView</button>
      <button onClick={() => handleNavigation('/people_view')}>PeopleView</button>
    </StyledNav>
  );
};

const Layout = ({ children }) => {
  return (
    <Container>
      <Navbar />
      <Content>{children}</Content>
    </Container>
  );
};

export default Layout;
