import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_QUEST_MUTATION } from './QuestList';
import { GET_QUEST } from './QuestDetails';

const CREATE_QUEST_MUTATION = gql`
  mutation CreateQuest(
    $title: String!
    $description: String!
    $reward: String
    $campaignName: String!
    $npc: String
    $location: String
  ) {
    createQuest(
      title: $title
      description: $description
      reward: $reward
      campaignName: $campaignName
      npc: $npc
      location: $location
    ) {
      quest {
        id
        title
        description
      }
    }
  }
`;

function QuestForm() {
  const navigate = useNavigate();
  const { campaign_name } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [npc, setNpc] = useState('');
  const [location, setLocation] = useState('');

  const [createQuest, { loading, error }] = useMutation(CREATE_QUEST_MUTATION);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createQuest({
      variables: {
        title,
        description,
        reward,
        campaignName: campaign_name,
        npc,
        location,
      },
    });
    navigate(`/campaigns/${campaign_name}/quests`);
    setTitle('');
    setDescription('');
    setReward('');
    setNpc('');
    setLocation('');
  };

  return (
    <>
      <h3>Create Quest</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          required={true}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          required={true}
          type="text"
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="reward">Reward:</label>
        <input
          id="reward"
          type="text"
          value={reward}
          onChange={(event) => setReward(event.target.value)}
        />

        <label htmlFor="npc">Quest Giver:</label>
        <input
          id="npc"
          type="text"
          value={npc}
          onChange={(event) => setNpc(event.target.value)}
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

export default QuestForm;
