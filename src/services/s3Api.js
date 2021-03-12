import {RNS3} from 'react-native-aws3';

import {Storage} from 'aws-amplify';
import amplifyConfig from '~/config/amplifyConfig';

export async function s3Upload(file, filename, type, folder = '') {
  const name = `${folder}${filename}`;
  const stored = await Storage.put(name, file, {
    contentType: type,
  });
  return stored.key;
}

// get signed image url or return url directly (if already a url)
export async function getImageUrl(name) {
  if (name && name.substring(0, 4).toLowerCase() !== 'http') {
    const url = await Storage.get(name, {level: 'public'});
    return url;
  }
  return name;
}

export function getBaseS3() {
  // return `${amplifyConfig.s3Params.url}/${amplifyConfig.s3Params.bucket}/public`
  return `https://${amplifyConfig.s3Params.bucket}.s3.amazonaws.com/public`;
}

export function uploadS3(uri, filename, type, prefix) {
  const imgFile = {
    uri: uri,
    name: filename,
    type: type,
  };
  const optionsAws = {
    keyPrefix: prefix,
    bucket: amplifyConfig.s3Params.bucket,
    region: amplifyConfig.s3Params.region,
    accessKey: amplifyConfig.s3Params.accessKey,
    secretKey: amplifyConfig.s3Params.secretKey,
    successActionStatus: 201,
  };
  return RNS3.put(imgFile, optionsAws);
}
