import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from './Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import useImageUpload from '../hooks/useImageUpload';

const CREATE_CHARACTER_MUTATION = gql`
  mutation CreateCharacter(
    $firstName: String!
    $lastName: String!
    $bio: String!
    $backstory: String
    $campaignName: String!
    $imageUrl: String
    $keyWords: String
  ) {
    createCharacter(
      firstName: $firstName
      lastName: $lastName
      bio: $bio
      campaignName: $campaignName
      backstory: $backstory
      imageUrl: $imageUrl
      keyWords: $keyWords
    ) {
      character {
        id
        firstName
        lastName
        bio
      }
    }
  }
`;

function CharacterForm({ campaignId }) {
  const navigate = useNavigate();
  const { campaign_name } = useParams();
  const { fileOnChangeHandler, submitHandler } = useImageUpload({
    resourceType: 'character',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [backstory, setBackstory] = useState('');
  const [keyWords, setKeyWords] = useState('');

  const [createCharacter, { loading, error }] = useMutation(
    CREATE_CHARACTER_MUTATION
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { getUrl } = await submitHandler();

    await createCharacter({
      variables: {
        firstName,
        lastName,
        bio,
        campaignName: campaign_name,
        backstory,
        imageUrl: getUrl,
        keyWords,
      },
    });
    navigate(`/campaigns/${campaign_name}/characters`);
    setFirstName('');
    setLastName('');
    setBio('');
  };

  return (
    <>
      <h2>Create Character</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
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

        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />

        <label htmlFor="backstory">Backstory:</label>
        <textarea
          id="backstory"
          value={backstory}
          onChange={(event) => setBackstory(event.target.value)}
        />

        <label htmlFor="keyWords">Key Words:</label>
        <textarea
          id="keyWords"
          value={keyWords}
          onChange={(event) => setKeyWords(event.target.value)}
        />
        <div className={styles.infoText}>
          {
            'Enter additional taggable keywords separated by a comma (e.g "JT, Jim Tim"). Be aware that these will need to be unique as well.'
          }
        </div>

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

export default CharacterForm;
