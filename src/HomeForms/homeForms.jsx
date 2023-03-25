import { useState, useRef, FormEventHandler } from 'react';
import { gql, useMutation } from '@apollo/client';
import Login from './login';
import KeyWordTextInput from '../keyWordTextInput';
import Register from './register';

const HomeForms = () => {
  const [formState, setFormState] = useState('LOGIN');

  return (
    <>
      {formState === 'REGISTER' && <Register />}
      {formState === 'LOGIN' && <Login />}
      <button
        onClick={() =>
          setFormState(formState === 'REGISTER' ? 'LOGIN' : 'REGISTER')
        }
      >
        {formState === 'REGISTER'
          ? 'Switch to Login'
          : 'Switch to registration'}
      </button>
      {/* <div className="App">
        <KeyWordTextInput />
      </div> */}
    </>
  );
};

export default HomeForms;
