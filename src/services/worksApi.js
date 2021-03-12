import {Auth, API} from 'aws-amplify';

import {getJob} from './jobsApi';

export function listWork(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('work', `/works/${query}`, cfg);
  });
}

export function getWork(emp, dat, ema, skl) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('work', `/work/${emp}/${dat}/${ema}/${skl}`, cfg);
  });
}

export function workEvent(emp, dat, ema) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('work', `/work-event/${emp}/${dat}/${ema}`, cfg);
  });
}

export function insertWork(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('work', '/work', cfg);
  });
}

export function updateWork(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.put('work', '/work', cfg);
  });
}

export function deleteWork(emp, dat, ema, skl) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.del('work', `/work/${emp}/${dat}/${ema}/${skl}`, cfg);
  });
}

export function insertWorkUser(user, event, tsk) {
  return getJob(event.ema, event.dat, tsk).then(job => {
    const data = {
      emp: user.ema,
      dat: event.dat,
      ema: event.ema,
      tsk: job.tsk,
      pic: job.pic,
      pip: user.pic,
      val: job.val,
      tit: event.tit,
      ini: event.ini,
      fim: event.fim,
      nom: event.nom,
      reg: event.reg,
    };
    return insertWork(data);
  });
}

export function workGroupAval(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.put('work', '/work-group-aval', cfg);
  });
}

export function workHistory(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('work', `/work-history/${query}`, cfg);
  });
}

export function workAloc(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('work', `/work-aloc/${query}`, cfg);
  });
}
