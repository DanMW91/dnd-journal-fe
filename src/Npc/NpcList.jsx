import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ListStyles from '../css/Lists.module.css';

const GET_NPCS = gql`
  query Npcs($campaignName: String!) {
    npcs(campaignName: $campaignName) {
      id
      firstName
      lastName
      description
    }
  }
`;

const NpcList = () => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_NPCS, {
    variables: { campaignName: campaign_name },
  });

  useEffect(() => {
    refetch();
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div>
        <h2>NPC List</h2>
        <Link to={`/campaigns/${campaign_name}/npcs/new`}>
          <button>Create NPC</button>
        </Link>
      </div>
      <ul className={ListStyles.list}>
        {data &&
          data.npcs.map((npc) => (
            <Link to={`/campaigns/${campaign_name}/npcs/${npc.firstName}`}>
              <li key={npc.id}>
                {npc.firstName} {npc.lastName}
              </li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default NpcList;
