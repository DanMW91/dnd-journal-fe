import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ListStyles from '../css/Lists.module.css';

const GET_WRITE_UPS = gql`
  query WriteUps($campaignName: String!) {
    writeUps(campaignName: $campaignName) {
      title
      sessionNumber
    }
  }
`;

const WriteUpList = () => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_WRITE_UPS, {
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
        <h2>Write-up List</h2>
        <Link to={`/campaigns/${campaign_name}/write-ups/new`}>
          <button>Create Write Up</button>
        </Link>
      </div>
      <ul className={ListStyles.list}>
        {data &&
          data.writeUps.map((writeUp, i) => (
            <Link
              to={`/campaigns/${campaign_name}/write-ups/${writeUp.sessionNumber}`}
            >
              <li key={i}>
                Session {writeUp.sessionNumber} - {writeUp.title}
              </li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default WriteUpList;
