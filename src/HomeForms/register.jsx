import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styles from './forms.module.css';

const REGISTER_USER = gql`
  mutation UserRegister(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    userRegister(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      credentials {
        accessToken
        client
        uid
      }
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { setAuthState } = useContext(AuthContext);

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await registerUser({
        variables: { email, password, passwordConfirmation },
      });
      const { accessToken, client, uid } = data.userRegister.credentials;
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('uid', uid);
      localStorage.setItem('loginStatus', 'loggedIn');
      setAuthState({ loggedIn: true });
      window.location.href = '/campaigns';
      // do something with the returned data, such as redirect to a dashboard page
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
      <div>
        <label htmlFor="passwordConfirmation">Confirm Password:</label>
        <input
          type="password"
          id="passwordConfirmation"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Register'}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
};

export default Register;
