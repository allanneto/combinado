import {Auth, API} from 'aws-amplify';

export function listJobs(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('job', `/jobs/${query}`, cfg);
  });
}

export function getJob(ema, dat, skl) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('job', `/job/${ema}/${dat}/${skl}`, cfg);
  });
}

export function updateJob(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.put('job', '/job', cfg);
  });
}

export function deleteJob(ema, dat, skl) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.del('job', `/job/${ema}/${dat}/${skl}`, cfg);
  });
}

export function insertJob(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('job', '/job', cfg);
  });
}
