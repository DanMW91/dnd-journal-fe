import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styles from '../Character/Character.module.css';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { UPDATE_QUEST_MUTATION } from './QuestList';
import { GET_QUEST } from './QuestDetails';

function UpdateQuestForm() {
  const navigate = useNavigate();
  const { campaign_name, quest_title } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  const [npc, setNpc] = useState('');
  const [location, setLocation] = useState('');

  const [updateQuest, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_QUEST_MUTATION);

  const { loading, error, data } = useQuery(GET_QUEST, {
    variables: {
      questTitle: quest_title,
      campaignName: campaign_name,
    },
  });

  if (data && !title) {
    setTitle(data.quest.title);
    setDescription(data.quest.description);
    setReward(data.quest?.reward || '');
    setNpc(data.quest?.npc?.firstName || '');
    setLocation(data.quest?.location?.name || '');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await updateQuest({
      variables: {
        questId: data.quest.id,
        title,
        description,
        reward,
        campaignName: campaign_name,
        npc,
        location,
        complete: null,
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
      <h3>Edit Quest</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          required={true}
          type="text"
          id="title"
          value={title}
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

export default UpdateQuestForm;
