import { useState, useRef, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import KeyWordTextDisplay from './keyWordTextDisplay';
import classes from './css/keyWordPopup.module.css';
import { Link, useParams } from 'react-router-dom';

const QUERY_KEY_WORDABLE_RESOURCE = gql`
  query keyWordable($keyWordableId: ID!, $keyWordableType: String!) {
    keyWordable(
      keyWordableId: $keyWordableId
      keyWordableType: $keyWordableType
    ) {
      ... on Campaign {
        name
        id
      }
      ... on Character {
        displayInfo
        displayTitle
        campaign {
          id
        }
      }
      ... on Npc {
        displayInfo
        displayTitle
        campaign {
          id
        }
      }
      ... on Quest {
        displayInfo
        displayTitle
        campaign {
          id
        }
      }
      ... on Location {
        displayInfo
        displayTitle
        campaign {
          id
        }
      }
      ... on NotableGroup {
        displayInfo
        displayTitle
        campaign {
          id
        }
      }
    }
  }
`;

const KeyWordPopup = ({ resourceType, resourceId, children }) => {
  const { campaign_name } = useParams();
  const [showInfo, setShowInfo] = useState(false);
  const keyWordPopupRef = useRef();
  const { loading, error, data } = useQuery(QUERY_KEY_WORDABLE_RESOURCE, {
    variables: { keyWordableId: resourceId, keyWordableType: resourceType },
  });

  useEffect(() => {
    if (keyWordPopupRef.current) {
      const { x } = keyWordPopupRef.current.getBoundingClientRect();
      if (x < 0) {
        keyWordPopupRef.current.style.left = 0;
      }
    }
  }, [showInfo]);

  return (
    <>
      <strong
        className={classes.keyWord}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        {data && showInfo && (
          <div
            ref={keyWordPopupRef}
            onMouseEnter={() => setShowInfo(true)}
            // onMouseLeave={() => setShowInfo(false)}
            className={classes.infoBox}
          >
            {/* <h3 className={classes.title}> */}
            <Link
              to={`/campaigns/${campaign_name}/${data.keyWordable.__typename.toLowerCase()}s/${
                data.keyWordable.displayTitle
              }`}
            >
              {data.keyWordable.displayTitle}
            </Link>
            {/* </h3> */}
            <KeyWordTextDisplay
              campaignId={data.keyWordable.campaign.id}
              text={data.keyWordable.displayInfo}
            />
          </div>
        )}
        {children}
      </strong>
    </>
  );
};

export default KeyWordPopup;
