import { useLocation } from 'react-router-dom'; // Import useLocation

function FooterNav({ isAuthenticated, isReviewer, handleAction, removeAction, toggleModal}) {
  const location = useLocation(); // Use useLocation to get the current location

  if (!isAuthenticated || !isReviewer) {
    return null;
  }

  // Function to conditionally render buttons based on the current route
  const renderButtons = () => {
    switch (location.pathname) {
      case '/review':
        return (
          <>
            <button className="footer-button" onClick={() => handleAction('approve')}>Approve</button>
            <button className="footer-button" onClick={() => handleAction('rework')}>Change</button>
            <button className="footer-button" onClick={() => handleAction('delete')}>Delete</button>
          </>
        );
      case '/approve':
        // Example buttons for publishing
        return (
          <>
            <button className="footer-button" onClick={() => handleAction('rework')}>Change</button>
            <button className="footer-button" onClick={toggleModal}>Comment</button>
            <button className="footer-button" onClick={() => handleAction('publish')}>Queue for Publish</button>
          </>
        );      
      case '/rework':
        // Example buttons for commenting
        return (
          <button className="footer-button" onClick={() => handleAction('delete')}>Discard</button>
        );
      case '/delete':
        return (
          <>
            <button className="footer-button" onClick={() => handleAction('rework')}>Change</button>
            <button className="footer-button" onClick={() => removeAction()}>Delete from Dropbox</button>
          </>
        );
      default:
        // Example buttons for default case
        return (
          <button className="footer-button">No function</button>
        );
    }
  };

  return (
    <div className="button-container">
      {renderButtons()}
    </div>
  );
}

export default FooterNav;