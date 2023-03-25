import { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { keyWordifyText } from './utils/textKeyWordFormatter.jsx';
import { KEY_WORDS_QUERY } from './keyWordTextInput';
import styles from './KeyWord.module.css';

const KeyWordTextDisplay = ({ text, campaignId }) => {
  const [keyWords, setKeyWords] = useState({
    keyWordsArr: [],
    keyWordObjects: [{}],
  });

  const [content, setContent] = useState(['']);
  const { loading, error, data, refetch } = useQuery(KEY_WORDS_QUERY, {
    variables: { campaignId: campaignId },
  });

  useEffect(() => {
    refetch();
  });

  if (data && keyWords.keyWordsArr.length < 1) {
    setKeyWords({
      keyWordsArr: data.keyWords.map((keyWordObj) => keyWordObj.keyWord),
      keyWordObjects: data.keyWords,
    });
  }

  useEffect(() => {
    setContent(
      keyWordifyText(text, keyWords.keyWordsArr, 3, keyWords.keyWordObjects)
    );
  }, [keyWords, text]);
  return (
    <>
      <div className={styles.display}>{content}</div>
    </>
  );
};

export default KeyWordTextDisplay;
