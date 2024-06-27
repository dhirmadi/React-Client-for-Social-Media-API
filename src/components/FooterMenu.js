import React from 'react';
import { NavLink } from 'react-router-dom';


const NavBar = ({ isAuthenticated, canViewImage, isReviewer, loginWithRedirect, handleLogout }) => {
  return (
    <div className="navbar-container">
      <div className="menu">
        {isAuthenticated && canViewImage && (
          <NavLink to="/" className="menu-item">Home</NavLink>
        )}
        {isAuthenticated && isReviewer && (
          <NavLink to="/review" className="menu-item">Review</NavLink>
        )}
        {isAuthenticated && canViewImage && (
          <NavLink to="/approve" className="menu-item">Approve</NavLink>
        )}
        {isAuthenticated && isReviewer && (
          <NavLink to="/rework" className="menu-item">Change</NavLink>
        )}        
        {isAuthenticated && isReviewer && (
          <NavLink to="/delete" className="menu-item">Delete</NavLink>
        )}
      </div>
      <div className="header">
        <div className="auth-button-container">
          {!isAuthenticated ? (
            <button className="auth-button" onClick={() => loginWithRedirect()}>Log In</button>
          ) : (
            <button className="auth-button" onClick={handleLogout}>Log Out</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default NavBar;