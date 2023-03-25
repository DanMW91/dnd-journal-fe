import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import useImageUpload from '../hooks/useImageUpload';

const CREATE_NPC_MUTATION = gql`
  mutation CreateNpc(
    $firstName: String!
    $lastName: String!
    $description: String!
    $campaignName: String!
    $imageUrl: String
  ) {
    createNpc(
      firstName: $firstName
      lastName: $lastName
      description: $description
      campaignName: $campaignName
      imageUrl: $imageUrl
    ) {
      npc {
        id
        firstName
        lastName
        description
      }
    }
  }
`;

function NpcForm({ campaignId }) {
  const navigate = useNavigate();
  const { campaign_name } = useParams();
  const { fileOnChangeHandler, submitHandler } = useImageUpload({
    resourceType: 'npc',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');

  const [createNpc, { loading, error }] = useMutation(CREATE_NPC_MUTATION);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { getUrl } = await submitHandler();

    await createNpc({
      variables: {
        firstName,
        lastName,
        description,
        campaignName: campaign_name,
        imageUrl: getUrl,
      },
    });
    navigate(`/campaigns/${campaign_name}/npcs`);
    setFirstName('');
    setLastName('');
    setDescription('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name:</label>
      <input
        type="text"
        id="firstName"
        value={firstName}
        required={true}
        onChange={(event) => setFirstName(event.target.value)}
      />

      <label htmlFor="lastName">Last Name:</label>
      <input
        type="text"
        id="lastName"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />

      <label htmlFor="description">description:</label>
      <textarea
        id="description"
        value={description}
        required={true}
        onChange={(event) => setDescription(event.target.value)}
      />
      <label htmlFor="image">Image:</label>
      <input onChange={fileOnChangeHandler} type="file" id="image" />

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>

      {error && <p>Error: {error.message}</p>}
    </form>
  );
}

export default NpcForm;
