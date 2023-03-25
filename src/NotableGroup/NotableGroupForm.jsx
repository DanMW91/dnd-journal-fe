import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

const CREATE_NOTABLE_GROUP_MUTATION = gql`
  mutation CreateNotableGroup(
    $name: String!
    $description: String!
    $npcs: String
    $campaignName: String!
    $characters: String
    $location: String
  ) {
    createNotableGroup(
      name: $name
      description: $description
      npcs: $npcs
      campaignName: $campaignName
      characters: $characters
      location: $location
    ) {
      notableGroup {
        id
        name
        description
      }
    }
  }
`;

function NotableGroupForm() {
  const navigate = useNavigate();
  const { campaign_name } = useParams();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [npcs, setNpcs] = useState('');
  const [characters, setCharacters] = useState('');
  const [location, setLocation] = useState('');

  const [createNotableGroup, { loading, error }] = useMutation(
    CREATE_NOTABLE_GROUP_MUTATION
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createNotableGroup({
      variables: {
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
      <h3>Create Notable Group</h3>
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
        <div className={styles.infoText}>
          {
            'Enter NPCs and Characters by their first name (case insensitive) separated by a comma (e.g "jeff, dave").'
          }
        </div>
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <div className={styles.infoText}>
          {'Enter single location by name (case insensitive).'}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>

        {error && <p>Error: {error.message}</p>}
      </form>
    </>
  );
}

export default NotableGroupForm;
