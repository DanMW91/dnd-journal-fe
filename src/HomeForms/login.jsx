import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import styles from './forms.module.css';

const LOGIN_USER = gql`
  mutation UserLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      credentials {
        uid
        client
        accessToken
      }
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthState } = useContext(AuthContext);

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await loginUser({ variables: { email, password } });

      const { accessToken, client, uid } = data.userLogin.credentials;
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('uid', uid);
      localStorage.setItem('loginStatus', 'loggedIn');
      setAuthState({ loggedIn: true });
      window.location.href = '/campaigns';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className={styles.formStyle} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default Login;
