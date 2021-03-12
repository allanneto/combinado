// endpoints per stage
const userUrl = {
  dev: 'https://gr10ejwvra.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://fphwsyh5v0.execute-api.us-east-1.amazonaws.com/pro',
};
const eventUrl = {
  dev: 'https://bw10iik0a7.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://dj879e9473.execute-api.us-east-1.amazonaws.com/pro',
};
const workUrl = {
  dev: 'https://x2yswyce23.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://ka9huj31p4.execute-api.us-east-1.amazonaws.com/pro',
};
const skillUrl = {
  dev: 'https://2jq0gq1c9e.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://d2osvoi0gb.execute-api.us-east-1.amazonaws.com/pro',
};
const jobUrl = {
  dev: 'https://kejwyem5kh.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://tptxqi9e82.execute-api.us-east-1.amazonaws.com/pro',
};
const notificaUrl = {
  dev: 'https://z3s1dwm44k.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://n9lcame6s5.execute-api.us-east-1.amazonaws.com/pro',
};
const chatUrl = {
  dev: 'https://rcyq9t6u21.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://s0806ap0le.execute-api.us-east-1.amazonaws.com/pro',
};
const teamUrl = {
  dev: 'https://1qmd61iaqc.execute-api.us-east-1.amazonaws.com/dev',
  pro: '',
};
const ccUrl = {
  dev: 'https://3cpl0nyvo7.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'https://ffwhj7lkqi.execute-api.us-east-1.amazonaws.com/pro',
};
// Ids per stage
const userPoolId = {
  dev: 'us-east-1_1DE8JWApx',
  pro: 'us-east-1_zjafuSlhC',
};
const identityPoolId = {
  dev: 'us-east-1:e8891f23-ddfd-45e7-8e93-e04160888137',
  pro: 'us-east-1:cf597d70-91fd-4ce9-8e8a-cdedef5e2354',
};
const userPoolWebClientId = {
  dev: '33outrf5mect4jgdglpodic85b',
  pro: '47h4t9dtn6ppp0f56m1ggn7sm',
};
const uploadBucket = {
  dev: 'combinado-data-dev',
  pro: 'combinado-data',
};

const oneSignalConfig = {
  dev: {
    key: '33c9a0f5-4a49-410a-a1d4-c21958bcbd5c',
    restKey: 'Basic MTJiMTIwZDAtZjIxNS00ZDdiLThlNTgtNzQ2ODQyZjQzZDYx',
  },
  pro: {
    key: '0190a74c-0405-4b7f-a5ae-76823bc50a4d',
    restKey: 'Basic NWI4ZTZlZmMtYmZjZC00ZDEyLWE1N2QtYzE3YTJlYzM0YjVj',
  },
};

const webSocketUrl = {
  dev: 'wss://0nre5ypl56.execute-api.us-east-1.amazonaws.com/dev',
  pro: 'wss://xrbq36k7gc.execute-api.us-east-1.amazonaws.com/pro',
};

// current stage dev/pro
const stage = 'pro';
const comp = '201221.1230';

const amplifyConfig = {
  stage: stage,
  compilation: stage === 'dev' ? '(dev)' : '',
  version: comp,
  oneSignal: oneSignalConfig[stage],
  webSocket: webSocketUrl[stage],
  Auth: {
    mandatorySignIn: true,
    region: 'us-east-1',
    userPoolId: userPoolId[stage],
    identityPoolId: identityPoolId[stage],
    userPoolWebClientId: userPoolWebClientId[stage],
  },
  Storage: {
    region: 'us-east-1',
    bucket: uploadBucket[stage],
    identityPoolId: identityPoolId[stage],
  },
  s3Params: {
    bucket: uploadBucket[stage],
    region: 'us-east-1',
    accessKey: 'AKIA4XV2SWGP2OTUCUAU',
    secretKey: '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',
  },
  API: {
    endpoints: [
      {
        name: 'user',
        endpoint: userUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'event',
        endpoint: eventUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'job',
        endpoint: jobUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'skill',
        endpoint: skillUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'work',
        endpoint: workUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'chat',
        endpoint: chatUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'team',
        endpoint: teamUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'notifica',
        endpoint: notificaUrl[stage],
        region: 'us-east-1',
      },
      {
        name: 'cc',
        endpoint: ccUrl[stage],
        region: 'us-east-1',
      },
    ],
  },
};

export default amplifyConfig;
