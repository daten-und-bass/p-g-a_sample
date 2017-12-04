'use strict';

const fs = require('fs');

(function readSecrets() {
  process.env.PGA_WEB_HTTPS_PUB = fs.readFileSync(process.env.HOME + '/' + process.env.PGA_WEB_HTTPS_PUB_FILE, 'utf8');
  process.env.PGA_WEB_HTTPS_KEY = fs.readFileSync(process.env.HOME + '/' + process.env.PGA_WEB_HTTPS_KEY_FILE, 'utf8');  
})();

module.exports = {
  web: {
    https: {
      pub: 'PGA_WEB_HTTPS_PUB',
      key: 'PGA_WEB_HTTPS_KEY',
    },
  },
};

