import {Auth, API} from 'aws-amplify';
import axios from 'axios';

import OneSignal from 'react-native-onesignal';

import {readUser} from './usersApi';
import {userModel} from '~/config/models';
import amplifyConfig from '~/config/amplifyConfig';

export const onSignalKey = amplifyConfig.oneSignal.key;
const onSignalRESTKey = amplifyConfig.oneSignal.restKey;

// export const onSignalKey = '0190a74c-0405-4b7f-a5ae-76823bc50a4d'
// const onSignalRESTKey = 'Basic NWI4ZTZlZmMtYmZjZC00ZDEyLWE1N2QtYzE3YTJlYzM0YjVj'

const NOTIFY = true;

export async function sendNotification(
  title,
  text,
  player = null,
  region = null,
  skills = null,
) {
  const cfg = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: onSignalRESTKey,
    },
  };
  const url = 'https://onesignal.com/api/v1/notifications';

  const filters = [];
  if (region) {
    filters.push({field: 'tag', key: 'reg', relation: '=', value: region});
  }
  let opr = false;
  if (skills) {
    // eslint-disable-next-line no-unused-vars
    for (const skill of skills) {
      if (opr) {
        filters.push({operator: 'OR'});
      }
      filters.push({field: 'tag', key: skill, relation: '=', value: '1'});
      opr = true;
    }
  }
  var message = {
    app_id: onSignalKey,
    headings: {en: title},
    contents: {en: text},
  };
  if (player) {
    message.include_player_ids = [player];
  } else {
    message.included_segments = ['All'];
  }
  if (filters.length > 0) {
    message.filters = filters;
  }
  if (NOTIFY) {
    return axios.post(url, message, cfg);
  }
}

export async function notify(userId, title, subtitle, text) {
  const user = await readUser(userId);
  // const data = {};
  // const contents = {en: text};
  const other = {headings: {en: title}};
  if (subtitle) {
    other.subtitle = {en: subtitle};
  }
  if (user && user.ntk) {
    // OneSignal.postNotification(contents, data, user.ntk, other);
    sendNotification(title, text, user.ntk);
  }
}

export async function oneTag(userId, reg = '') {
  const user = await readUser(userId);
  const tags = {
    prs: user.prs,
    gen: user.gen || '',
    reg: user.reg,
    email: user.ema || '',
  };
  if (reg) {
    tags.reg = reg;
  }
  // eslint-disable-next-line no-unused-vars
  for (const lin of userModel.skl) {
    tags[lin.key] = 0;
  }
  // eslint-disable-next-line no-unused-vars
  for (const skl of user.skl) {
    tags[skl] = 1;
  }
  OneSignal.sendTags(tags);
}

export function createNotification(dst, tit, txt, user, event, tsk, sta = 0) {
  const data = {
    dst: dst,
    tit: tit,
    txt: txt,
    ema: event.ema,
    dat: event.dat,
    tsk: tsk,
    rem: user.ema,
    nom: user.nom,
    pic: user.pic,
    sta: sta,
  };
  // insert notification
  return insertNotifica(data).then(() => {
    notify(dst, tit, txt, txt);
  });
}

export function createChatMessage(data) {
  // insert notification
  return insertNotifica(data).then(() => {
    notify(data.dst, data.tit, '', data.txt);
  });
}

export function insertNotifica(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('notifica', '/notification', cfg);
  });
}

export function updateNotifica(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.put('notifica', '/notification', cfg);
  });
}

export function listNotifica(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notifications/${query}`, cfg);
  });
}

export function listNotificaMsg(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notifications-msg/${query}`, cfg);
  });
}

export function readNotifica(dst, tms) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notification/${dst}/${tms}`, cfg);
  });
}

export function deleteNotifica(dst, tms) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.del('notifica', `/notification/${dst}/${tms}`, cfg);
  });
}

export function notificationSent(rem, ema, dat) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notification-sent/${rem}/${ema}/${dat}`, cfg);
  });
}

export function notificationSentList(rem) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notification-sent-list/${rem}`, cfg);
  });
}

export function canSendNotifica(ema, dat, rem) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notifica-send/${ema}/${dat}/${rem}`, cfg);
  });
}

export function outsNotifica(userId) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notifica-outs/${userId}`, cfg);
  });
}

export function outsJobNotifica(userId, jobId) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('notifica', `/notifica-outs-job/${userId}/${jobId}`, cfg);
  });
}

// export function createMessage(
//   userRem,
//   destId,
//   title,
//   text,
//   event,
//   skill,
//   sta = 0,
// ) {
//   const data = {
//     userId: destId,
//     ntfTime: Date.now() * -1,
//     sendId: userRem.userId,
//     eventId: event.eventId,
//     nom: userRem.nom,
//     ema: userRem.ema,
//     pic: userRem.pic,
//     tit: title,
//     txt: text,
//     sta: sta,
//     skill: skill,
//   };
//   // insert notification
//   insertNotifica(data).then(() => {
//     notify(destId, title, event.tit, text);
//   });
// }

// export function listNotifica(filter) {
//   return Auth.currentSession().then(session => {
//     const cfg = {
//       body: filter,
//       headers: {
//         Authorization: session.idToken.jwtToken,
//       },
//     };
//     return API.post('notifica', '/notifications', cfg);
//   });
// }
