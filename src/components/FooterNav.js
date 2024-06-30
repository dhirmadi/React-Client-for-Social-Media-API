import React from 'react';

function FooterNav({ isAuthenticated, isReviewer, handleAction }) {
  if (!isAuthenticated || !isReviewer) {
    return null;
  }

  return (
    <div className="button-container">
      <button className="footer-button" onClick={() => handleAction('approve')}>Publish</button>
      <button className="footer-button" onClick={() => handleAction('rework')}>Change</button>
      <button className="footer-button" onClick={() => handleAction('delete')}>Discard</button>
    </div>
  );
}

export default FooterNav;