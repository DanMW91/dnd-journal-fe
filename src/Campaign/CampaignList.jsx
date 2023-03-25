import React from 'react';
import { useQuery, gql } from '@apollo/client';
import styles from './Campaign.module.css';
import { Link } from 'react-router-dom';

const GET_CAMPAIGNS = gql`
  query Campaigns {
    campaigns {
      name
    }
  }
`;

const CampaignList = () => {
  const { loading, error, data } = useQuery(GET_CAMPAIGNS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Campaign List</h2>
      <ul className={styles.campaignList}>
        {data.campaigns.map((campaign) => (
          <Link to={`/campaigns/${campaign.name}`}>
            <li className={styles.campaignListItem} key={campaign.id}>
              {campaign.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;
