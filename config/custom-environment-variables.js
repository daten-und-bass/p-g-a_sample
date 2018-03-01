'use strict';

const fs = require('fs');

(function readSecrets() {
  process.env.PGA_WEB_HTTPS_PUB = fs.readFileSync(process.env.HOME + '/' + process.env.PGA_SAMPLE_WEB_HTTPS_PUB_PATH, 'utf8');
  process.env.PGA_WEB_HTTPS_KEY = fs.readFileSync(process.env.HOME + '/' + process.env.PGA_SAMPLE_WEB_HTTPS_KEY_PATH, 'utf8');

  // http://expressjs.com/en/guide/behind-proxies.html
  process.env.PGA_SAMPLE_WEB_PROXIES = isNaN(parseInt(process.env.PGA_SAMPLE_WEB_PROXIES)) ? false : parseInt(process.env.PGA_SAMPLE_WEB_PROXIES);
})();

module.exports = {
  web: {
    https: {
      pub: 'PGA_WEB_HTTPS_PUB',
      key: 'PGA_WEB_HTTPS_KEY',
    },
    proxies: 'PGA_SAMPLE_WEB_PROXIES',
  },
};

