import LoginForm from '../components/component_Login/LoginForm';
import React from 'react';
import LoginNav from '../components/component_NavBar/LoginNav';
import ForgotPassword from '../components/component_ForgottenPassword/ForgotPassword';

import './LoginRegisterPage.css';

function LoginPage() {
  return (
    <div className="login_registerPage">
      <LoginNav />
      <div className="login_registerMain">
        <h1>Login</h1>
        <LoginForm />
      </div>
      <ForgotPassword />
    </div>
  );
}
export default LoginPage;
