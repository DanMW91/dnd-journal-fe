import React, { useState, useEffect } from 'react';
import styles from '../Character/Character.module.css';
import { useQuery, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';
import WriteUpMentions from '../Character/WriteUpMentions';
import ListStyles from '../css/Lists.module.css';

export const GET_QUEST = gql`
  query Quest($questTitle: String!, $campaignName: String!) {
    quest(questTitle: $questTitle, campaignName: $campaignName) {
      campaign {
        id
      }
      id
      title
      location {
        id
        name
      }
      npc {
        firstName
      }
      description
      reward
      complete
    }
  }
`;

const QuestDetails = () => {
  const { quest_title, campaign_name } = useParams();

  const { loading, error, data } = useQuery(GET_QUEST, {
    variables: {
      questTitle: quest_title,
      campaignName: campaign_name,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <>
          <h2 className={styles.heading}>{data.quest.title}</h2>
          <Link to={`/campaigns/${campaign_name}/quests/${quest_title}/edit`}>
            <button>Edit Quest</button>
          </Link>
          <div className={styles.detailsContainer}>
            <div className={styles.multiDetailContainer}>
              <div className={styles.bioContainer}>
                <h3>Description:</h3>
                <KeyWordTextDisplay
                  campaignId={data.quest.campaign.id}
                  text={data.quest.description}
                />
              </div>

              <div className={styles.bioContainer}>
                <h3>Rewards:</h3>
                {data.quest.reward}
              </div>
            </div>
            <div className={ListStyles.listsContainer}>
              <WriteUpMentions
                style={ListStyles.questMentionsContainer}
                resourceType={'Quest'}
                resourceId={data.quest.id}
              />
              <div className={ListStyles.questMentionsContainer}>
                <h3 className={ListStyles.title}>Quest Giver:</h3>
                <ul className={ListStyles.list}>
                  {data.quest?.npc && (
                    <Link
                      to={`/campaigns/${campaign_name}/npcs/${data.quest.npc.firstName}`}
                    >
                      <li>
                        {data.quest.npc.firstName} {data.quest.npc.lastName}
                      </li>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestDetails;
