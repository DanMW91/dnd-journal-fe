import styles from './Campaign.module.css';
import { Routes, useParams } from 'react-router-dom';
import { Outlet, Link } from 'react-router-dom';

const CampaignContainer = () => {
  const { campaign_name: campaign } = useParams();
  return (
    <>
      <nav className={styles.navbar}>
        <ul>
          <h3>{campaign}</h3>
          <Link to={`/campaigns/${campaign}/quests`}>
            <li>Quests</li>
          </Link>
          <Link to={`/campaigns/${campaign}/characters`}>
            <li>Characters</li>
          </Link>
          <Link to={`/campaigns/${campaign}/npcs`}>
            <li>NPC's</li>
          </Link>
          <Link to={`/campaigns/${campaign}/notablegroups`}>
            <li>Notable Groups</li>
          </Link>
          <Link to={`/campaigns/${campaign}/locations`}>
            <li>Locations</li>
          </Link>
          <Link to={`/campaigns/${campaign}/write-ups`}>
            <li>Write Ups</li>
          </Link>
        </ul>
      </nav>
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </>
  );
};
export default CampaignContainer;
