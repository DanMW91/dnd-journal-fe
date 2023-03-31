import React, { useState, useEffect } from 'react';
import styles from '../Character/Character.module.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, Link, useNavigate } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';
import WriteUpMentions from '../Character/WriteUpMentions';
import useImageUpload from '../hooks/useImageUpload';

const GET_LOCATION = gql`
  query Location($locationName: String!, $campaignName: String!) {
    location(locationName: $locationName, campaignName: $campaignName) {
      campaign {
        id
      }
      locationMap {
        id
      }
      id
      name
      description
    }
  }
`;

const CREATE_MAP_MUTATION = gql`
  mutation CreateMap($locationId: ID!, $url: String!) {
    createMap(locationId: $locationId, url: $url) {
      mapId
    }
  }
`;

const LocationDetails = () => {
  const navigate = useNavigate();
  const [showAddMap, setShowAddMap] = useState(false);
  const params = useParams();
  const { fileOnChangeHandler, submitHandler } = useImageUpload({
    resourceType: 'character',
  });

  const { loading, error, data } = useQuery(GET_LOCATION, {
    variables: {
      locationName: params.location_name,
      campaignName: params.campaign_name,
    },
  });

  const [createMap, { loading: mapLoading }] = useMutation(CREATE_MAP_MUTATION);

  const handleSubmitMap = async (e) => {
    e.preventDefault();
    const { getUrl } = await submitHandler();
    const res = await createMap({
      variables: {
        url: getUrl,
        locationId: data.location.id,
      },
    });
    if (res.data.createMap.mapId) {
      console.log(res.data.createMap.mapId);
      navigate(res.data.createMap.mapId);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <>
          <h2 className={styles.heading}>{data.location.name}</h2>
          {!data.location.locationMap?.id && (
            <button onClick={() => setShowAddMap(true)}>Add Map</button>
          )}
          {data.location.locationMap?.id && (
            <Link to={`${data.location.locationMap.id}`}>
              <button>View Map</button>
            </Link>
          )}
          <div className={styles.detailsContainer}>
            <div className={styles.bioContainer}>
              {showAddMap && (
                <form onSubmit={handleSubmitMap}>
                  <label htmlFor="image">Map:</label>
                  <input
                    onChange={fileOnChangeHandler}
                    type="file"
                    id="image"
                  />

                  <button type="submit" disabled={loading}>
                    {mapLoading ? 'Loading...' : 'Submit'}
                  </button>

                  {error && <p>Error: {error.message}</p>}
                </form>
              )}
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
