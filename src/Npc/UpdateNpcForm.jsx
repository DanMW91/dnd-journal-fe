import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_NPC } from './NpcDetails';
import useImageUpload from '../hooks/useImageUpload';

const UPDATE_NPC_MUTATION = gql`
  mutation UpdateNpc(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $description: String!
    $campaignName: String!
    $imageUrl: String
  ) {
    updateNpc(
      id: $id
      firstName: $firstName
      description: $description
      lastName: $lastName
      campaignName: $campaignName
      imageUrl: $imageUrl
    ) {
      npc {
        id
      }
    }
  }
`;

function UpdateNpcForm() {
  const navigate = useNavigate();
  const { campaign_name, npc_name } = useParams();
  const { fileOnChangeHandler, submitHandler } = useImageUpload({
    resourceType: 'npc',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');

  const [updateNpc, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_NPC_MUTATION);

  const { loading, error, data } = useQuery(GET_NPC, {
    variables: {
      npcName: npc_name,
      campaignName: campaign_name,
    },
  });

  if (data && !firstName) {
    setFirstName(data.npc.firstName);
    setLastName(data.npc.lastName);
    setDescription(data.npc.description);
    setId(data.npc.id);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { getUrl } = await submitHandler();

    await updateNpc({
      variables: {
        id,
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
    <>
      <h3>Edit NPC</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          required={true}
          type="text"
          id="firstName"
          value={firstName}
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
          required={true}
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="image">Image:</label>
        <input onChange={fileOnChangeHandler} type="file" id="image" />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>

        {error && <p>Error: {error.message}</p>}
      </form>
    </>
  );
}

export default UpdateNpcForm;
