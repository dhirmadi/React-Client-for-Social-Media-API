import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavBar.css';

const NavBar = ({ isAuthenticated, canViewImage, isReviewer, loginWithRedirect, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Home'); // Initial value for the menu button
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuItemClick = (item) => { setSelectedMenuItem(item); toggleMenu(); };

  return (
    <header className="header">
      <div className="nav-left">
        <button type="button" className="menu-toggle" onClick={toggleMenu}>
          {selectedMenuItem}
        </button>
        <nav className={`navbar-container ${isMenuOpen ? 'open' : ''}`}>
          <ul className="menu">
            {isAuthenticated && canViewImage && (<li><NavLink exact to="/" activeClassName="active" className="menu-item" onClick={() => handleMenuItemClick('Home')}>Home</NavLink></li>
            )}
            {isAuthenticated && isReviewer && (<li><NavLink to="/review" activeClassName="active" className="menu-item" onClick={() => handleMenuItemClick('Review')}>Review</NavLink></li>
            )}
            {isAuthenticated && canViewImage && (<li><NavLink to="/approve" activeClassName="active" className="menu-item" onClick={() => handleMenuItemClick('Approve')}>Approve</NavLink></li>
            )}
            {isAuthenticated && isReviewer && (<li><NavLink to="/rework" activeClassName="active" className="menu-item" onClick={() => handleMenuItemClick('Change')}>Change</NavLink></li>
            )}
            {isAuthenticated && isReviewer && (<li><NavLink to="/delete" activeClassName="active" className="menu-item" onClick={() => handleMenuItemClick('Delete')}>Delete</NavLink></li>
            )}
          </ul>
        </nav>
      </div>
      <div className="nav-right">
        {!isAuthenticated ? (
          <button type="button" className="auth-button" onClick={loginWithRedirect}>Log In</button>
        ) : (
          <button type="button" className="auth-button" onClick={handleLogout}>Log Out</button>
        )}
      </div>
    </header>
  );
};

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  canViewImage: PropTypes.bool.isRequired,
  isReviewer: PropTypes.bool.isRequired,
  loginWithRedirect: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;