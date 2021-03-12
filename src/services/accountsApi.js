import {Auth, API} from 'aws-amplify';

export function listAccounts(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('cc', `/ccs/${query}`, cfg);
  });
}

export function mailAccounts(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('cc', `/cc-mail/${query}`, cfg);
  });
}

export function getAccount(ema, dat, skl) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('cc', `/cc/${ema}/${dat}/${skl}`, cfg);
  });
}

export function getBalance(email) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: {
        ema: email,
      },
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('cc', '/cc-balance', cfg);
  });
}

export function withdraw(email, val) {
  return Auth.currentSession().then(session => {
    const cfg = {
      body: {
        ema: email,
        val: val,
      },
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.post('cc', '/cc-withdraw', cfg);
  });
}

export function getTransfers(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('cc', `/tbs/${query}`, cfg);
  });
}
