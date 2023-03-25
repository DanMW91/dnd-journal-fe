import React, { useState, useEffect } from 'react';
import styles from '../Character/Character.module.css';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';
import WriteUpMentions from '../Character/WriteUpMentions';

const GET_LOCATION = gql`
  query Location($locationName: String!, $campaignName: String!) {
    location(locationName: $locationName, campaignName: $campaignName) {
      campaign {
        id
      }
      id
      name
      description
    }
  }
`;

const LocationDetails = () => {
  const params = useParams();

  const { loading, error, data } = useQuery(GET_LOCATION, {
    variables: {
      locationName: params.location_name,
      campaignName: params.campaign_name,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <>
          <h2 className={styles.heading}>{data.location.name}</h2>
          <div className={styles.detailsContainer}>
            <div className={styles.bioContainer}>
              <h3>Details:</h3>
              <KeyWordTextDisplay
                campaignId={data.location.campaign.id}
                text={data.location.description}
              />
            </div>
            <WriteUpMentions
              resourceType={'Location'}
              resourceId={data.location.id}
            />
          </div>
        </>
      )}
    </>
  );
};

export default LocationDetails;
