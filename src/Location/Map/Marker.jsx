import KeyWordPopup from '../../keyWordPopup';
import styles from './Map.module.css';

const COLOUR_MAP = {
  Character: '#e73f3f',
  Quest: '#bdb433',
  Location: '#34c54a',
  Npc: '#2e2ec5',
};

const Marker = ({ marker }) => {
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: `${marker.offsetX}%`,
        top: `${marker.offsetY}%`,
      }}
    >
      <KeyWordPopup
        key={1}
        resourceType={marker.markerableType}
        resourceId={marker.markerableId}
      >
        <div
          style={{
            backgroundColor: COLOUR_MAP[marker.markerableType],
          }}
          className={styles.marker}
        ></div>
      </KeyWordPopup>
    </div>
  );
};

export default Marker;
