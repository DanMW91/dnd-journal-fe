import React, { useState, useEffect } from 'react';
import styles from './Character.module.css';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';
import WriteUpMentions from './WriteUpMentions';

const GET_CHARACTER = gql`
  query Character($characterName: String!, $campaignName: String!) {
    character(characterName: $characterName, campaignName: $campaignName) {
      campaign {
        id
      }
      id
      firstName
      lastName
      bio
      imageUrl
      backstory
    }
  }
`;

const CharacterDetails = () => {
  const params = useParams();

  const { loading, error, data } = useQuery(GET_CHARACTER, {
    variables: {
      characterName: params.character_name,
      campaignName: params.campaign_name,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <>
          <h2 className={styles.heading}>
            {data.character.firstName} {data.character.lastName}
          </h2>
          <div className={styles.detailsContainer}>
            <div className={styles.bioContainer}>
              {data.character.imageUrl && (
                <img
                  className={styles.displayImage}
                  src={data.character.imageUrl}
                />
              )}
              <h3>Bio:</h3>
              <KeyWordTextDisplay
                campaignId={data.character.campaign.id}
                text={data.character.bio}
              />
              {data.character?.backstory && (
                <>
                  <h3>Backstory:</h3>
                  <KeyWordTextDisplay
                    campaignId={data.character.campaign.id}
                    text={data.character.backstory}
                  />
                </>
              )}
            </div>
            <WriteUpMentions
              resourceType={'Character'}
              resourceId={data.character.id}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CharacterDetails;
