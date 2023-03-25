import React, { useState, useEffect } from 'react';
import styles from '../Character/Character.module.css';
import { useQuery, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';
import WriteUpMentions from '../Character/WriteUpMentions';

export const GET_NPC = gql`
  query Npc($npcName: String!, $campaignName: String!) {
    npc(npcName: $npcName, campaignName: $campaignName) {
      campaign {
        id
      }
      id
      firstName
      lastName
      description
      imageUrl
    }
  }
`;

const NpcDetails = () => {
  const params = useParams();

  const { loading, error, data } = useQuery(GET_NPC, {
    variables: {
      npcName: params.npc_name,
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
            {data.npc.firstName} {data.npc.lastName}
          </h2>
          <Link
            to={`/campaigns/${params.campaign_name}/npcs/${params.npc_name}/edit`}
          >
            <button>Edit NPC</button>
          </Link>
          <div className={styles.detailsContainer}>
            <div className={styles.bioContainer}>
              {data.npc.imageUrl && (
                <img className={styles.displayImage} src={data.npc.imageUrl} />
              )}
              <h3>Bio:</h3>
              <KeyWordTextDisplay
                campaignId={data.npc.campaign.id}
                text={data.npc.description}
              />
            </div>
            <WriteUpMentions resourceType={'Npc'} resourceId={data.npc.id} />
          </div>
        </>
      )}
    </>
  );
};

export default NpcDetails;
