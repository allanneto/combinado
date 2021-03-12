export function encodeParam(param) {
  // eslint-disable-next-line no-undef
  return Buffer.from(JSON.stringify(param)).toString('base64');
}

export function truncateWords(str, nr) {
  const ending = '...';
  const mxw = str.split(' ');
  const nrw = str.split(' ', nr);
  if (mxw.length > nr) {
    return nrw.join(' ') + ending;
  } else {
    return str;
  }
}
