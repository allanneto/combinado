import {Auth, API} from 'aws-amplify';

export function queryUsers(query) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('user', `/users/${query}`, cfg);
  });
}

export function readUser(id) {
  return Auth.currentSession().then(session => {
    const cfg = {
      headers: {
        Authorization: session.idToken.jwtToken,
      },
    };
    return API.get('user', `/user-read/${id}`, cfg);
  });
}

export function statusProfile(user) {
  if (
    !user.pic ||
    !user.loc ||
    !user.cep ||
    !user.reg ||
    !user.bir ||
    !user.gen ||
    !user.cpf
    // !user.ban ||
    // !user.age ||
    // !user.cta
  ) {
    return false;
  }
  return true;
}

export function statusProfileOrg(user) {
  if (
    !user.pic ||
    !user.loc ||
    !user.cep ||
    !user.reg ||
    (!user.cpf && !user.cnpj)
    // ||
    // !user.crn ||
    // !user.crs ||
    // !user.crn ||
    // !user.crh ||
    // !user.crv
  ) {
    return false;
  }
  return true;
}
