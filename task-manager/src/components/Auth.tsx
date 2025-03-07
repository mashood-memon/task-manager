import React from 'react';
import Login from './Login';
import Register from './Register';

export default function Auth() {
  const [showLogin, setShowLogin] = React.useState(true);

  return showLogin ? (
    <Login onSwitch={() => setShowLogin(false)} />
  ) : (
    <Register 
      onSuccess={() => setShowLogin(true)}
      onSwitch={() => setShowLogin(true)}
    />
  );
}