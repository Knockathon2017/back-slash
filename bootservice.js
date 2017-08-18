'use strict';

import config from 'exframe-configuration';

// TODO: Need to implement in a better way
config.get('default').then((settings) => {
  global.settings = settings.service;
  require('./index').default(); // eslint-disable-line global-require
});
