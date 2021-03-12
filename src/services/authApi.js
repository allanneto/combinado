import {Auth, API} from 'aws-amplify';

import {userModel} from '~/config/models';

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

import amplifyConfig from '~/config/amplifyConfig';

const POOL_DATA = {
  UserPoolId: amplifyConfig.Auth.userPoolId,
  ClientId: amplifyConfig.Auth.userPoolWebClientId,
};
const userPool = new CognitoUserPool(POOL_DATA);

export function signUpUser(
  username,
  name,
  password,
  sur = '',
  bir = '',
  gen = '',
  cel = '',
) {
  return Auth.signUp({
    username,
    password,
    attributes: {
      name: name,
      'custom:sur': sur,
      'custom:bir': bir,
      'custom:gen': gen,
      'custom:cel': cel,
    },
  });
  //   attributes: { name: name, picture: '/images/anonymous.png', phone_number: `+55${phone}` }
}

export function signUpUser2(org, org_name, usr, email, name, password) {
  const username = `${usr}@${org}`;
  return Auth.signUp({
    username,
    password,
    attributes: {name, email, 'custom:org': org, 'custom:org_name': org_name},
  });
}

export function currentUser() {
  return Auth.currentAuthenticatedUser();
}

export function confirmUser(username, code) {
  return Auth.confirmSignUp(username, code);
}

export function resendCode(username) {
  return Auth.resendSignUp(username);
}

export function signInUser(email, password) {
  return Auth.signIn(email, password);
}

export function forgotPassword(email) {
  return Auth.forgotPassword(email);
}

export function confirmPassword(email, password, code) {
  return Auth.forgotPasswordSubmit(email, code, password);
}

export function changeCurrentPassword(password1, password2) {
  return Auth.currentAuthenticatedUser().then(user => {
    return Auth.changePassword(user, password1, password2);
  });
}

export function getAuthenticatedUser() {
  return Auth.currentAuthenticatedUser();
}

export function logout() {
  return Auth.signOut();
}

export function currentSession() {
  return Auth.currentSession().then(session => {
    return Auth.currentUserInfo().then(user => {
      const attr = {
        sub: user.username,
        userId: user.username,
        ...user.attributes,
      };
      const cfg = {
        headers: {
          Authorization: session.idToken.jwtToken,
        },
      };
      return API.get('user', '/user', cfg)
        .then(response => {
          userModel.profile.forEach(item => {
            attr[item] = response[item];
          });
          const result = {
            user: {...attr},
          };
          return result;
        })
        .catch(err => console.log(err));
    });
  });
}

export function updateUser(data) {
  return Auth.currentSession().then(session => {
    return Auth.currentAuthenticatedUser().then(() => {
      const cfg = {
        body: data,
        headers: {
          Authorization: session.idToken.jwtToken,
        },
      };
      API.put('user', '/user', cfg);
    });
  });
}

export function deleteTheUser(email, password) {
  return new Promise((resolve, reject) => {
    const authData = {
      Username: email,
      Password: password,
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess() {
        cognitoUser.deleteUser((err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
}

export function userGroups() {
  return Auth.currentAuthenticatedUser().then(
    user => user.signInUserSession.accessToken.payload['cognito:groups'],
  );
}
