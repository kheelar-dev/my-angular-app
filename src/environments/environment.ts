import { version } from '../../package.json';
export const environment = {
    appVersion: version,
    production: false,
    defaultauth: 'fakebackend',
    firebaseConfig: {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    },
    baseUrl: ""
};