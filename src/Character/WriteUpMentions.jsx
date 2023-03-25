import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import Styles from './Character.module.css';
import ListStyles from '../css/Lists.module.css';

const GET_WRITE_UPS_FOR_MENTIONS = gql`
  query WriteUpsForMentions($resourceType: String!, $resourceId: ID!) {
    writeUpsForMentions(resourceType: $resourceType, resourceId: $resourceId) {
      title
      sessionNumber
    }
  }
`;

const WriteUpMentions = ({ resourceType, resourceId, style }) => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(
    GET_WRITE_UPS_FOR_MENTIONS,
    {
      variables: {
        resourceType: resourceType,
        resourceId: parseInt(resourceId),
      },
    }
  );

  useEffect(() => {
    refetch();
  });

  return (
    <div className={style ? style : Styles.mentionsContainer}>
      <h3 className={ListStyles.title}>Write up Appearances:</h3>
      <ul className={ListStyles.list}>
        {data &&
          data.writeUpsForMentions.map((writeUp, i) => (
            <Link
              to={`/campaigns/${campaign_name}/write-ups/${writeUp.sessionNumber}`}
            >
              <li key={i}>
                Session {writeUp.sessionNumber} - {writeUp.title}
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default WriteUpMentions;
