import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './HeaderNav.css';

const HeaderNav = ({ isAuthenticated, loginWithRedirect, handleLogout }) => {
  return (
    <div className="header">
      <div className="auth-button-container">
        {!isAuthenticated ? (
          <button className="auth-button" onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
          <nav className="nav-container">
            <ul className="nav-items">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li> {/* Use Link */}
              <li className="nav-item"><Link className="nav-link" to="/review">Select</Link></li> {/* Use Link */}
              <li className="nav-item"><Link className="nav-link" to="/approve">Publish</Link></li> {/* Use Link */}
              <li className="nav-item"><Link className="nav-link" to="/rework">Comment</Link></li> {/* Use Link */}
              <li className="nav-item"><Link className="nav-link" to="/delete">Recover</Link></li> {/* Use Link */}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default HeaderNav;