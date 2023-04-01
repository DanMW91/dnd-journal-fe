import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import styles from './Map.module.css';
import infoBoxStyle from '../../css/keyWordPopup.module.css';

import Marker from './Marker';

const GET_LOCATION_MAP = gql`
  query locationMap($mapId: ID!) {
    locationMap(mapId: $mapId) {
      markers {
        offsetX
        offsetY
        markerableType
        markerableId
      }
      imageUrl
    }
  }
`;

const CREATE_MARKER_MUTATION = gql`
  mutation createMarker(
    $mapId: ID!
    $resourceType: String!
    $resourceName: String!
    $campaignName: String!
    $offsetY: String!
    $offsetX: String!
  ) {
    createMarker(
      mapId: $mapId
      resourceType: $resourceType
      resourceName: $resourceName
      campaignName: $campaignName
      offsetX: $offsetX
      offsetY: $offsetY
    ) {
      marker {
        id
      }
    }
  }
`;

const offsetToPercentage = ({ offset, max }) => {
  const diff = max / offset;
  const floatOffset = 100 / diff;
  return Number.parseFloat(floatOffset).toFixed(1);
};

const Map = () => {
  const { campaign_name, location_name, map_id } = useParams();
  const [resourceFilter, setResourceFilter] = useState('All');
  const [clickedPosition, setClickedPosition] = useState(null);
  const [markers, setMarkers] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState(null);
  const [resourceName, setResourceName] = useState('');
  const popupRef = useRef();

  const { loading, error, data, refetch } = useQuery(GET_LOCATION_MAP, {
    variables: {
      mapId: map_id,
    },
  });

  const [createMarker, { loading: markerLoading, error: markerError }] =
    useMutation(CREATE_MARKER_MUTATION);

  useEffect(() => {
    if (popupRef.current) {
      const { x } = popupRef.current.getBoundingClientRect();
      if (x < 0) {
        popupRef.current.style.left = 0;
      }
    }
  }, [clickedPosition]);

  const handleClickOnMap = (e) => {
    if (resourceFilter === 'All') return;
    setClickedPosition({
      offsetX: offsetToPercentage({
        offset: e.nativeEvent.offsetX,
        max: e.target.width,
      }),
      offsetY: offsetToPercentage({
        offset: e.nativeEvent.offsetY,
        max: e.target.height,
      }),
    });
  };

  const handleSubmitMarkerForm = async (e) => {
    e.preventDefault();

    const { data } = await createMarker({
      variables: {
        mapId: map_id,
        resourceType: resourceFilter,
        resourceName: resourceName,
        campaignName: campaign_name,
        offsetY: clickedPosition.offsetY,
        offsetX: clickedPosition.offsetX,
      },
    });

    if (data.createMarker.marker.id) {
      refetch();
      setClickedPosition(null);
      setResourceName('');
    }
  };

  const toggleResourceFilter = (resource) => {
    if (resource === 'All') {
      setResourceFilter('All');
      setFilteredMarkers(markers);
    } else if (!markers || !markers[0]) {
      setResourceFilter(resource);
    } else {
      const markersFiltered = markers.filter(
        (marker) => marker.markerableType === resource
      );
      setResourceFilter(resource);
      setFilteredMarkers(markersFiltered);
    }
  };

  useEffect(() => {
    if (data && data.locationMap.markers[0]) {
      setMarkers(data.locationMap.markers);
      setFilteredMarkers(data.locationMap.markers);
    }
  }, [data]);

  return (
    <>
      <h3>{location_name}</h3>
      <div>
        <button
          className={
            resourceFilter === 'All'
              ? styles.allButtonClicked
              : styles.allButton
          }
          onClick={() => toggleResourceFilter('All')}
        >
          All
        </button>
        <button
          className={
            resourceFilter === 'Npc'
              ? styles.npcButtonClicked
              : styles.npcButton
          }
          onClick={() => toggleResourceFilter('Npc')}
        >
          NPCs
        </button>
        <button
          className={
            resourceFilter === 'Character'
              ? styles.characterButtonClicked
              : styles.characterButton
          }
          onClick={() => toggleResourceFilter('Character')}
        >
          Characters
        </button>
        <button
          className={
            resourceFilter === 'Location'
              ? styles.locationButtonClicked
              : styles.locationButton
          }
          onClick={() => toggleResourceFilter('Location')}
        >
          Locations
        </button>
        <button
          className={
            resourceFilter === 'Quest'
              ? styles.questButtonClicked
              : styles.questButton
          }
          onClick={() => toggleResourceFilter('Quest')}
        >
          Quests
        </button>
      </div>
      <div
        onMouseDown={handleClickOnMap}
        style={{
          display: 'inline-block',
          position: 'relative',
          width: '90%',
        }}
      >
        {data && (
          <img
            src={data.locationMap.imageUrl}
            style={{
              width: '100%',
            }}
          />
        )}
        {filteredMarkers &&
          filteredMarkers.map((marker) => (
            <Marker key={marker.id} marker={marker} />
          ))}
        {clickedPosition && (
          <div
            className={styles.overlay}
            onClick={() => setClickedPosition(null)}
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className={styles.infoBox}
              style={{
                position: 'absolute',
              }}
              ref={popupRef}
            >
              <h3>{`Add ${resourceFilter}`}</h3>
              <form onSubmit={handleSubmitMarkerForm}>
                <label htmlFor="resourceName">Name:</label>
                <input
                  type="text"
                  id="resourceName"
                  value={resourceName}
                  required={true}
                  onChange={(event) => setResourceName(event.target.value)}
                />
                <button type="submit">Submit</button>
              </form>
              <button onClick={() => setClickedPosition(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Map;
