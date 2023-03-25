import KeyWordPopup from '../keyWordPopup';

const textToArray = (text) => {
  return text.split(' ');
};

const generatePartialCheckFunctions = (numWords) => {
  return [...Array(numWords)].map((_, i) => {
    return (textContentArray, j) => {
      return textContentArray.slice(j - (i + 1), j + 1).join(' ');
    };
  });
};

const generateCheckFunctions = (maxLength) => {
  return [...Array(maxLength)].map((_, i) => {
    return (textContentArray) => {
      const wordToCheck = textContentArray.slice(-(i + 1));
      return {
        word: wordToCheck.join(' '),
        length: wordToCheck.length,
      };
    };
  });
};

export const keyWordifyText = (text, keyWords, maxLength, keyWordsObjects) => {
  const keyWordifiedText = [];
  const lowerCaseKeyWords = keyWords.map((word) => word.toLowerCase());
  const functions = generateCheckFunctions(maxLength);
  const textArr = text.split(' ');
  for (let i = 0; i < textArr.length; i++) {
    const currWordArr = textArr.slice(0, i + 1);
    const wordObjArr = functions
      .map((fn) => fn.apply('', [currWordArr]))
      .reverse();
    let matched = false;
    let placed = false;
    wordObjArr.forEach((wordObj) => {
      if (lowerCaseKeyWords.includes(wordObj.word.toLowerCase())) {
        matched = true;

        const [keyWordObject] = keyWordsObjects.filter(
          ({ keyWord }) => keyWord.toLowerCase() === wordObj.word.toLowerCase()
        );

        keyWordifiedText.splice(
          -wordObj.length,
          wordObj.length,
          <KeyWordPopup
            key={i}
            resourceType={keyWordObject.keyWordableType}
            resourceId={keyWordObject.keyWordableId}
          >
            {wordObj.word + ' '}
          </KeyWordPopup>
        );
      } else {
        if (!matched && !placed) {
          keyWordifiedText.push(wordObjArr.slice(-1)[0].word + ' ');
          placed = true;
        }
      }
    });
  }
  return keyWordifiedText;
};

export const textKeyWordFormatter = (text, keyWords) => {
  const contentArray = textToArray(text).filter((word) => word != ' ');
  const functions = generateCheckFunctions(3);

  return contentArray.reduce((acc, currWord, i) => {
    const match = functions
      .map((fn) => {
        return fn.call('', contentArray, i);
      })
      .map((keyWord, j) => {
        if (['dog water', 'flangrin'].includes(keyWord)) {
          acc.splice(
            i - keyWord.split(' ').length + 1,
            keyWord.split(' ').length - 1
          );
          acc.push(<strong key={i}>{keyWord} </strong>);
          return true;
        }
      });
    const array = match.filter((el) => !!el);

    if (['dog water', 'flangrin'].includes(currWord)) {
      array.push(true);
      acc.splice(i - 1, 1);
      acc.push(<strong key={i}>{currWord} </strong>);
    }
    // if (array.length === 0) {
    //   acc.push(currWord + ' ');
    // }

    return acc;

    const twoPrev = contentArray.slice(i - 1, i + 1).join(' ');
    const threePrev = contentArray.slice(i - 2, i + 1).join(' ');

    if (keyWords.includes(threePrev)) {
    } else if (keyWords.includes(twoPrev)) {
      acc.splice(i - 1, 1);
      acc.push(<strong key={i}>{twoPrev} </strong>);
    } else if (keyWords.includes(currWord)) {
      acc.push(<strong key={i}>{currWord} </strong>);
    } else {
      acc.push(currWord + ' ');
    }

    return acc;
  }, []);
};

('One of the mighty Guardians of Forster. An unhinged lunatic but one who has proven himself to be a mighty warrior and along with the others in the guardians, saved Forster from the evil King Julian');
