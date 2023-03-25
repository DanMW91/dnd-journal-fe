import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import styles from '../HomeForms/forms.module.css';
const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($name: String!) {
    createCampaign(name: $name) {
      campaign {
        name
      }
    }
  }
`;

const CreateCampaignForm = () => {
  const [name, setName] = useState('');
  const [createCampaign, { loading, error }] = useMutation(CREATE_CAMPAIGN);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCampaign({ variables: { name } });
  };

  return (
    <form className={styles.formStyle} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {error && <p>Error: {error.message}</p>}
      <button type="submit" disabled={loading}>
        Create Campaign
      </button>
    </form>
  );
};

export default CreateCampaignForm;
