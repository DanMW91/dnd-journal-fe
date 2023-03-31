import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import imageCompression from 'browser-image-compression';

const CREATE_S3_URLS = gql`
  mutation CreateS3Urls($fileName: String!, $resourceType: String!) {
    createS3Urls(fileName: $fileName, resourceType: $resourceType) {
      getUrl
      postUrl
    }
  }
`;

const useImageUpload = ({ resourceType }) => {
  const [file, setFile] = useState(null);
  const [urls, setUrls] = useState({
    postUrl: '',
    getUrl: '',
  });

  const [createUrls, { loading, error }] = useMutation(CREATE_S3_URLS);

  const fileOnChangeHandler = async (e) => {
    setFile(e.target.files[0]);

    const res = await createUrls({
      variables: {
        fileName: e.target.files[0].name,
        resourceType: resourceType,
      },
    });
    setUrls({
      postUrl: res.data.createS3Urls.postUrl,
      getUrl: res.data.createS3Urls.getUrl,
    });
  };

  const submitHandler = async () => {
    if (!file) return { getUrl: null };

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 720,
    };

    const compressedFile = await imageCompression(file, options);
    console.log(urls.getUrl);
    const s3Data = await fetch(urls.postUrl, {
      method: 'PUT',
      body: compressedFile,
    });

    return { getUrl: urls.getUrl };
  };

  return {
    fileOnChangeHandler,
    submitHandler,
  };
};

export default useImageUpload;
