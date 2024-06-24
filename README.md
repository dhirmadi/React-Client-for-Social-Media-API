Sure! Here’s a `README.md` file for your project:

```markdown
# React Auth0 Image Viewer

A React application that fetches and displays random images from an API, with role-based access control using Auth0. The application features a fixed header and footer and scales the image to fit within the available space without scrolling.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Deployment](#deployment)
- [Usage](#usage)
- [Role-Based Access Control](#role-based-access-control)
- [Contributing](#contributing)
- [License](#license)

## Features

- Auth0 authentication
- Role-based access control
- Fetch and display random images from an API
- Responsive design for both desktop and mobile
- Fixed header and footer

## Prerequisites

- Node.js and npm
- An Auth0 account

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/react-auth0-image-viewer.git
   cd react-auth0-image-viewer
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

1. Create a `.env` file in the root of the project with the following environment variables:

   ```env
   REACT_APP_AUTH0_DOMAIN=your-auth0-domain
   REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   REACT_APP_AUTH0_AUDIENCE=your-api-identifier
   REACT_APP_API_URL=your-api-url
   REACT_APP_REDIRECT_URI=http://localhost:3000
   ```

2. Set up Auth0 with the following configurations:
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

3. Add an Auth0 rule to include roles in the ID token and access token:

   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = 'https://tanjax.smit.li/roles'; // Use your own namespace

     // Ensure the user has roles
     if (event.authorization) {
       api.idToken.setCustomClaim(namespace + 'roles', event.authorization.roles);
       api.accessToken.setCustomClaim(namespace + 'roles', event.authorization.roles);
     }
   };
   ```

## Running the App

1. Start the development server:
   ```sh
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Deployment

### Deploying to Heroku

1. Create a `server.js` file to serve your React app:

   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();

   app.use(express.static(path.join(__dirname, 'build')));

   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'build', 'index.html'));
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
   });
   ```

2. Create a `Procfile` in the root of your project:
   ```plaintext
   web: node server.js
   ```

3. Add a `start` script to your `package.json`:
   ```json
   "scripts": {
     "start": "node server.js",
     "build": "react-scripts build",
     "test": "react-scripts test",
     "eject": "react-scripts eject"
   }
   ```

4. Install Express:
   ```sh
   npm install express
   ```

5. Commit your changes and deploy to Heroku:
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   heroku create your-app-name
   git push heroku main
   ```

6. Set environment variables on Heroku:
   ```sh
   heroku config:set REACT_APP_AUTH0_DOMAIN=your-auth0-domain
   heroku config:set REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   heroku config:set REACT_APP_AUTH0_AUDIENCE=your-api-identifier
   heroku config:set REACT_APP_API_URL=your-api-url
   heroku config:set REACT_APP_REDIRECT_URI=https://your-app-name.herokuapp.com
   ```

7. Open your application:
   ```sh
   heroku open
   ```

## Usage

- Log in using the Auth0 authentication.
- Depending on your role, you will see different components:
  - Users with the `user` or `reviewer` role can view images.
  - Only users with the `reviewer` role can see the footer buttons.

## Role-Based Access Control

- **Roles Required to View Image**: `user` or `reviewer`
- **Roles Required to See Footer Buttons**: `reviewer`

Roles are added to the ID token and access token using an Auth0 rule. Ensure that your Auth0 application is configured correctly to include these roles.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
