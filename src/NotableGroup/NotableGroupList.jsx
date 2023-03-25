import React, { useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ListStyles from '../css/Lists.module.css';
// import questStyles from './Quest.module.css';

const GET_NOTABLE_GROUPS = gql`
  query NotableGroups($campaignName: String!) {
    notableGroups(campaignName: $campaignName) {
      id
      name
    }
  }
`;

const NotableGroupList = () => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_NOTABLE_GROUPS, {
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
        <h2>Notable Group List</h2>
        <Link to={`/campaigns/${campaign_name}/notablegroups/new`}>
          <button>Create Group</button>
        </Link>
      </div>
      <ul className={ListStyles.list}>
        {data &&
          data.notableGroups.map((notableGroup) => (
            <Link
              to={`/campaigns/${campaign_name}/notablegroups/${notableGroup.name}`}
            >
              <li key={notableGroup.id}>{notableGroup.name}</li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default NotableGroupList;
