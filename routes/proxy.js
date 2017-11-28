'use strict';

const express = require('express');
const router = express.Router();

const request = require('request');

const csrf = require('csurf');
const bodyParser = require('body-parser');

const config = require('config');

let csrfProtection = csrf({ cookie: true, ignoreMethods: [] });
let parseForm = bodyParser.urlencoded({ extended: false });

let webConfig = config.get('web');

/* GET "PGA - Sample" proxy for PGA (real) api and send requests there */
router.get(webConfig.proxy.subPath, parseForm, csrfProtection, function(req, res, next) {

  // res.header('Access-Control-Allow-Origin', 'https://p-g-a.daten-und-bass.io|local');

  let baseUrl = webConfig.api.address;
  let url = '';

  switch(req.query.endPoint) {
    case 'names':
      url = `${baseUrl}/${req.query.endPoint}?leadRegion=${req.query.leadRegion}`;
      break;
    case 'position':
    case 'object':  
      url = `${baseUrl}/${req.query.endPoint}/${req.query.postcode}`;
      break;
    default:
      url = webConfig.api.docs;
  }

  request.get(url, {
    'auth': {
      'bearer': webConfig.api.token,
    },
  }, function(error, response, body) {
    
    res.send(body);
  });
});

module.exports = router;
