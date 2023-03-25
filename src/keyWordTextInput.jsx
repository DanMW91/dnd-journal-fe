import { useRef, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { keyWordifyText } from './utils/textKeyWordFormatter.jsx';

export const KEY_WORDS_QUERY = gql`
  query keyWords($campaignId: ID!) {
    keyWords(campaignId: $campaignId) {
      keyWord
      keyWordableId
      keyWordableType
    }
  }
`;

const KeyWordTextInput = () => {
  const [keyWords, setKeyWords] = useState({
    keyWordsArr: [],
    keyWordObjects: [{}],
  });
  const [content, setContent] = useState(['']);
  const { loading, error, data } = useQuery(KEY_WORDS_QUERY, {
    variables: { campaignId: 2 },
  });

  if (data && keyWords.keyWordsArr.length < 1) {
    setKeyWords({
      keyWordsArr: data.keyWords.map((keyWordObj) => keyWordObj.keyWord),
      keyWordObjects: data.keyWords,
    });
  }
  const textInput = useRef(null);

  const onTextChange = () => {
    setContent(
      keyWordifyText(
        textInput.current?.value,
        keyWords.keyWordsArr,
        3,
        keyWords.keyWordObjects
      )
    );
  };

  return (
    <>
      <input type="text" ref={textInput} onChange={onTextChange} />
      <div>{content}</div>
    </>
  );
};

export default KeyWordTextInput;
