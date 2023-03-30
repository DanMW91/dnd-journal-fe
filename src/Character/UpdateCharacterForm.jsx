import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styles from './Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import useImageUpload from '../hooks/useImageUpload';
import { GET_CHARACTER } from './CharacterDetails';

const UPDATE_CHARACTER_MUTATION = gql`
  mutation UpdateCharacter(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $bio: String!
    $backstory: String
    $campaignName: String!
    $imageUrl: String
    $keyWords: String
  ) {
    updateCharacter(
      id: $id
      firstName: $firstName
      bio: $bio
      backstory: $backstory
      lastName: $lastName
      campaignName: $campaignName
      imageUrl: $imageUrl
      keyWords: $keyWords
    ) {
      character {
        id
      }
    }
  }
`;

function UpdateCharacterForm() {
  const navigate = useNavigate();
  const { campaign_name, character_name } = useParams();
  const { fileOnChangeHandler, submitHandler } = useImageUpload({
    resourceType: 'character',
  });
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [backstory, setBackstory] = useState('');
  const [keyWords, setKeyWords] = useState('');

  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: {
      characterName: character_name,
      campaignName: campaign_name,
    },
  });

  const [updateCharacter, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_CHARACTER_MUTATION);

  if (data && !firstName) {
    setFirstName(data.character.firstName);
    setLastName(data.character.lastName);
    setBio(data.character.bio);
    setId(data.character.id);
    setBackstory(data.character.backstory);
    if (data.character.keyWords) {
      setKeyWords(
        data.character.keyWords
          .map((kw) => {
            return kw.keyWord;
          })
          .join(', ')
      );
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { getUrl } = await submitHandler();

    await updateCharacter({
      variables: {
        id,
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
      <h2>Update Character</h2>
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

export default UpdateCharacterForm;
