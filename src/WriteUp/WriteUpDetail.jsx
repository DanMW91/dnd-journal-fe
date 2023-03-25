import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import KeyWordTextDisplay from '../keyWordTextDisplay';

const GET_WRITE_UP = gql`
  query WriteUp($sessionNumber: Int!, $campaignName: String!) {
    writeUp(sessionNumber: $sessionNumber, campaignName: $campaignName) {
      title
      content
      sessionNumber
      campaign {
        id
      }
    }
  }
`;

const WriteUpDetail = () => {
  const params = useParams();

  const { loading, error, data } = useQuery(GET_WRITE_UP, {
    variables: {
      sessionNumber: parseInt(params.session_number),
      campaignName: params.campaign_name,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {data && (
        <>
          <h2>
            Session {data.writeUp.sessionNumber} - {data.writeUp.title}
          </h2>
          <KeyWordTextDisplay
            campaignId={data.writeUp.campaign.id}
            text={data.writeUp.content}
          />
        </>
      )}
    </>
  );
};

export default WriteUpDetail;
