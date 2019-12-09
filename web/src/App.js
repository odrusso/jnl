import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'

Amplify.configure(awsconfig);

const signUpConfig = {
  defaultCountryCode: "64"
};

function App() {
  return (
    <div className="App">
      <h1>jnl.io dev</h1>
      
      <span role="img" aria-label="heart-emoji">❤️</span>  
    </div>
  );
}

export default withAuthenticator(App, {signUpConfig});
