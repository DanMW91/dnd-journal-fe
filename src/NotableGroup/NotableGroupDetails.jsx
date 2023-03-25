import React, { useState, useEffect } from 'react';
import styles from '../Character/Character.module.css';
import { useQuery, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';
import WriteUpMentions from '../Character/WriteUpMentions';
import ListStyles from '../css/Lists.module.css';

export const GET_NOTABLE_GROUP = gql`
  query NotableGroup($notableGroupName: String!, $campaignName: String!) {
    notableGroup(
      notableGroupName: $notableGroupName
      campaignName: $campaignName
    ) {
      campaign {
        id
      }
      id
      name
      location {
        id
        name
      }
      npcs {
        firstName
      }
      characters {
        firstName
      }
      description
    }
  }
`;

const NotableGroupDetails = () => {
  const { group_name, campaign_name } = useParams();

  const { loading, error, data } = useQuery(GET_NOTABLE_GROUP, {
    variables: {
      notableGroupName: group_name,
      campaignName: campaign_name,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <>
          <h2 className={styles.heading}>{data.notableGroup.name}</h2>
          <Link
            to={`/campaigns/${campaign_name}/notablegroups/${group_name}/edit`}
          >
            <button>Edit Group</button>
          </Link>
          <div className={styles.detailsContainer}>
            <div className={styles.multiDetailContainer}>
              <div className={styles.bioContainer}>
                <h3>Description:</h3>
                <KeyWordTextDisplay
                  campaignId={data.notableGroup.campaign.id}
                  text={data.notableGroup.description}
                />
              </div>
            </div>
            <div className={ListStyles.listsContainer}>
              <WriteUpMentions
                style={ListStyles.questMentionsContainer}
                resourceType={'NotableGroup'}
                resourceId={data.notableGroup.id}
              />
              <div className={ListStyles.questMentionsContainer}>
                <h3 className={ListStyles.title}>NPC Members:</h3>
                <ul className={ListStyles.list}>
                  {data.notableGroup?.npcs?.length > 0 &&
                    data.notableGroup?.npcs.map((npc) => {
                      console.log(npc);
                      return (
                        <Link
                          to={`/campaigns/${campaign_name}/npcs/${npc.firstName}`}
                        >
                          <li>
                            {npc.firstName} {npc.lastName}
                          </li>
                        </Link>
                      );
                    })}
                </ul>
              </div>
              <div className={ListStyles.questMentionsContainer}>
                <h3 className={ListStyles.title}>Character Members:</h3>
                <ul className={ListStyles.list}>
                  {data.notableGroup?.characters?.length > 0 &&
                    data.notableGroup.characters.map((character) => {
                      return (
                        <Link
                          to={`/campaigns/${campaign_name}/characters/${character.firstName}`}
                        >
                          <li>
                            {character.firstName} {character.lastName}
                          </li>
                        </Link>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotableGroupDetails;
