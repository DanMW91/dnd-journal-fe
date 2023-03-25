import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import checkmark from './checkmark.png';
import ListStyles from '../css/Lists.module.css';
import questStyles from './Quest.module.css';

const GET_QUESTS = gql`
  query Quests($campaignName: String!) {
    quests(campaignName: $campaignName) {
      id
      title
      complete
    }
  }
`;

export const UPDATE_QUEST_MUTATION = gql`
  mutation UpdateQuest(
    $questId: ID!
    $complete: Boolean
    $description: String
    $reward: String
    $npc: String
    $location: String
  ) {
    updateQuest(
      questId: $questId
      complete: $complete
      description: $description
      reward: $reward
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

const QuestList = () => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_QUESTS, {
    variables: { campaignName: campaign_name },
  });
  const [
    updateQuestStatus,
    { loading: loadingMutation, error: mutationError },
  ] = useMutation(UPDATE_QUEST_MUTATION);

  const handleSubmit = async (questId) => {
    event.preventDefault();

    await updateQuestStatus({
      variables: {
        questId,
        complete: true,
        description: null,
        reward: null,
        npc: null,
        location: null,
      },
    });
  };

  useEffect(() => {
    refetch();
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div>
        <h2>Quest List</h2>
        <Link to={`/campaigns/${campaign_name}/quests/new`}>
          <button>Create Quest</button>
        </Link>
      </div>
      <div className={questStyles.listContainer}>
        <h4>Incomplete Quests</h4>
        <ul className={questStyles.list}>
          {data &&
            data.quests.map(
              (quest) =>
                !quest.complete && (
                  <Link
                    to={`/campaigns/${campaign_name}/quests/${quest.title}`}
                  >
                    <li className={questStyles.incompleteQuests} key={quest.id}>
                      {quest.title}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubmit(quest.id);
                        }}
                        className={questStyles.checkmarkContainer}
                      >
                        <img
                          className={questStyles.checkmark}
                          src={checkmark}
                        />
                        complete
                      </div>
                    </li>
                  </Link>
                )
            )}
        </ul>
        <h4>Complete Quests</h4>
        <ul className={questStyles.list}>
          {data &&
            data.quests.map(
              (quest) =>
                quest.complete && (
                  <Link
                    to={`/campaigns/${campaign_name}/quests/${quest.title}`}
                  >
                    <li className={questStyles.completeQuests} key={quest.id}>
                      <div>{quest.title}</div> <div>Done</div>
                    </li>
                  </Link>
                )
            )}
        </ul>
      </div>
    </>
  );
};

export default QuestList;
