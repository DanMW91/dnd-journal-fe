import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

const CREATE_LOCATION_MUTATION = gql`
  mutation CreateLocation(
    $name: String!
    $description: String!
    $campaignName: String!
  ) {
    createLocation(
      name: $name
      description: $description
      campaignName: $campaignName
    ) {
      location {
        id
        name
        description
      }
    }
  }
`;

function LocationForm({ campaignId }) {
  const navigate = useNavigate();
  const { campaign_name } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [createLocation, { loading, error }] = useMutation(
    CREATE_LOCATION_MUTATION
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createLocation({
      variables: {
        name,
        description,
        campaignName: campaign_name,
      },
    });
    navigate(`/campaigns/${campaign_name}/locations`);
    setName('');
    setDescription('');
  };

  return (
    <>
      <h2>Create Location</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          required={true}
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          required={true}
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>

        {error && <p>Error: {error.message}</p>}
      </form>
    </>
  );
}

export default LocationForm;
