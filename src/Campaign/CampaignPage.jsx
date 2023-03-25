import React from 'react';
import CampaignList from './CampaignList';
import CreateCampaignForm from './CreateCampaignForm';
import styles from './Campaign.module.css';

const CampaignPage = () => {
  return (
    <div className={styles.campaignContainer}>
      <CreateCampaignForm />
      <CampaignList />
    </div>
  );
};

export default CampaignPage;
