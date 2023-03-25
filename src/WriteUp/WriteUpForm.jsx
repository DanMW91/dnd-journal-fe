import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import styles from '../Character/Character.module.css';

export const CREATE_WRITE_UP = gql`
  mutation CreateWriteUp(
    $campaignName: String!
    $session: Int!
    $title: String!
    $content: String!
  ) {
    createWriteUp(
      campaignName: $campaignName
      session: $session
      title: $title
      content: $content
    ) {
      writeUp {
        title
      }
    }
  }
`;

const WriteUpForm = () => {
  const navigate = useNavigate();
  const { campaign_name } = useParams();

  const [session, setSession] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [createWriteUp, { loading, error }] = useMutation(CREATE_WRITE_UP);

  const handleSubmit = (event) => {
    event.preventDefault();
    createWriteUp({
      variables: {
        campaignName: campaign_name,
        session: Number(session),
        title,
        content,
      },
    }).then(() => {
      // do something after the mutation is successful
      navigate(`/campaigns/${campaign_name}/write-ups`);
    });
  };

  return (
    <>
      <h2>Create Write Up</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="session">Session:</label>
        <input
          id="session"
          type="number"
          value={session}
          onChange={(event) => setSession(event.target.value)}
        />

        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          wrap="off"
          onChange={(event) => setContent(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
        {error && <p>{error.message}</p>}
      </form>
    </>
  );
};

export default WriteUpForm;
