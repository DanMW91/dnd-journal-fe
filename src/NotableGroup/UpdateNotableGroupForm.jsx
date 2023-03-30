import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_NOTABLE_GROUP } from './NotableGroupDetails';
import useImageUpload from '../hooks/useImageUpload';

const UPDATE_NOTABLE_GROUP_MUTATION = gql`
  mutation UpdateNotableGroup(
    $id: ID!
    $name: String!
    $description: String!
    $location: String!
    $npcs: String!
    $characters: String
    $campaignName: String!
  ) {
    updateNotableGroup(
      id: $id
      name: $name
      description: $description
      location: $location
      npcs: $npcs
      characters: $characters
      campaignName: $campaignName
    ) {
      notableGroup {
        id
      }
    }
  }
`;

function UpdateNotableGroupForm() {
  const navigate = useNavigate();
  const { campaign_name, group_name } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [npcs, setNpcs] = useState('');
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');
  const [id, setId] = useState('');

  const [updateNotableGroup, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_NOTABLE_GROUP_MUTATION);

  const { loading, error, data } = useQuery(GET_NOTABLE_GROUP, {
    variables: {
      notableGroupName: group_name,
      campaignName: campaign_name,
    },
  });

  if (data && !name) {
    let characterNames = '';
    let npcNames = '';

    if (data.notableGroup.characters) {
      console.log(data.notableGroup);
      characterNames = data.notableGroup.characters
        .map((character) => {
          return character.firstName;
        })
        .join(', ');
    }
    if (data.notableGroup.npcs) {
      npcNames = data.notableGroup.npcs
        .map((npc) => {
          return npc.firstName;
        })
        .join(', ');
    }

    setName(data.notableGroup.name);
    setDescription(data.notableGroup.description);
    setCharacters(characterNames || '');
    setNpcs(npcNames || '');
    setLocation(data.notableGroup?.location?.name || '');
    setId(data.notableGroup.id);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await updateNotableGroup({
      variables: {
        id,
        name,
        description,
        characters,
        campaignName: campaign_name,
        npcs,
        location,
      },
    });
    navigate(`/campaigns/${campaign_name}/notablegroups`);
    setName('');
    setDescription('');
    setCharacters('');
    setNpcs('');
    setLocation('');
  };

  return (
    <>
      <h3>Edit Notable Group</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="npcs">Npcs:</label>
        <input
          id="npcs"
          type="text"
          value={npcs}
          onChange={(event) => setNpcs(event.target.value)}
        />

        <label htmlFor="characters">Characters:</label>
        <input
          id="characters"
          type="text"
          value={characters}
          onChange={(event) => setCharacters(event.target.value)}
        />
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>

        {error && <p>Error: {error.message}</p>}
      </form>
    </>
  );
}

export default UpdateNotableGroupForm;
