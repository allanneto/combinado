import {Auth, API} from 'aws-amplify';

export function chatCreate(data) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: data,
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('chat', '/chat', cfg);
  });
}

export function chatEvent(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('chat', `/chat-event/${query}`, cfg);
  });
}

export function chatList(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('chat', `/chat-list/${query}`, cfg);
  });
}
