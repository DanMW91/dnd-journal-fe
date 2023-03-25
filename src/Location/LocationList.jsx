import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ListStyles from '../css/Lists.module.css';

const GET_LOCATIONS = gql`
  query Locations($campaignName: String!) {
    locations(campaignName: $campaignName) {
      id
      name
      description
    }
  }
`;

const LocationList = () => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS, {
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
        <h2>Location List</h2>
        <Link to={`/campaigns/${campaign_name}/locations/new`}>
          <button>Create Location</button>
        </Link>
      </div>
      <ul className={ListStyles.list}>
        {data &&
          data.locations.map((location) => (
            <Link to={`/campaigns/${campaign_name}/locations/${location.name}`}>
              <li key={location.id}>{location.name}</li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default LocationList;
