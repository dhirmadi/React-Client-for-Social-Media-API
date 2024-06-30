import React from 'react';

const HeaderNav = ({ isAuthenticated, loginWithRedirect, handleLogout }) => {
  return (
    <div className="header">
      <div className="auth-button-container">
        {!isAuthenticated ? (
          <button className="auth-button" onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
          <button className="auth-button" onClick={handleLogout}>Log Out</button>
        )}
      </div>
    </div>
  );
};

export default HeaderNav;