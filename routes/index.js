'use strict';

const express = require('express');
const router = express.Router();

const csrf = require('csurf');

const config = require('config');

let csrfProtection = csrf({ cookie: true });

let webConfig = config.get('web');

/* GET "PGA - Sample" and render index page. */
router.get('/', csrfProtection, function(req, res, next) {
  res.render('index', { 
  	title: 'Postcode Geopostion API - Sample',
  	csrfToken: req.csrfToken(),
  	proxyFullPath: `${webConfig.basePath}${webConfig.proxy.basePath}${webConfig.proxy.subPath}`,
  });
});

module.exports = router;
