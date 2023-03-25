import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ListStyles from '../css/Lists.module.css';

const GET_CHARACTERS = gql`
  query Characters($campaignName: String!) {
    characters(campaignName: $campaignName) {
      firstName
      lastName
      bio
    }
  }
`;

const CharacterList = () => {
  const { campaign_name } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_CHARACTERS, {
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
        <h2>Character List</h2>
        <Link to={`/campaigns/${campaign_name}/characters/new`}>
          <button>Create Character</button>
        </Link>
      </div>
      <ul className={ListStyles.list}>
        {data &&
          data.characters.map((character) => (
            <Link
              to={`/campaigns/${campaign_name}/characters/${character.firstName}`}
            >
              <li key={character.id}>
                {character.firstName} {character.lastName}
              </li>
            </Link>
          ))}
      </ul>
    </>
  );
};

export default CharacterList;
