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
let baseUrl = `${webConfig.api.host}${webConfig.api.basePath}${webConfig.api.subPath}`;
let accesstokenPath = `${webConfig.api.host}${webConfig.api.basePath}${webConfig.api.accesstokenPath}`;
let accesstokenReqOptions = {
  'url': accesstokenPath,
  'headers': {'content-type' : 'application/x-www-form-urlencoded'},
  'form': webConfig.api.oauth,
};
process.env.PGA_WEB_PROXY_TOKEN = 'noInitialToken'

/* GET "PGA - Sample" proxy for PGA (real) api and send requests there */
router.get(`${webConfig.proxy.subPath}`, parseForm, csrfProtection, function(req, res, next) {

  // res.header('Access-Control-Allow-Origin', 'https://p-g-a.daten-und-bass.io|local');

  let url = '';

  switch(req.query.endPoint) {
    case 'names':

      if (req.query.leadRegion && ! req.query.namesPattern) {

        url = `${baseUrl}/${req.query.endPoint}?leadRegion=${req.query.leadRegion}`;

      } else if (req.query.namesPattern && ! req.query.leadRegion) {

        url = `${baseUrl}/${req.query.endPoint}?namesPattern=${encodeURIComponent(req.query.namesPattern)}`;
        
      } else {

        url = webConfig.api.docs
      }
      break;
    case 'position':
    case 'object':  
      url = `${baseUrl}/${req.query.endPoint}/${req.query.postcode}`;
      break;
    case 'distance':
      url = `${baseUrl}/${req.query.endPoint}?start=${req.query.start}&end=${req.query.end}&unit=${req.query.unit}`;
      break;
    default:
      url = webConfig.api.docs;
  }

  request.get(url, { 'auth': { 'bearer': process.env.PGA_WEB_PROXY_TOKEN } }, function(error, response, body) {

    if (response.statusCode === 401) {

      request.post(accesstokenReqOptions, function(error, response, body) {
        
        process.env.PGA_WEB_PROXY_TOKEN = JSON.parse(body).access_token;

        request.get(url, { 'auth': { 'bearer': process.env.PGA_WEB_PROXY_TOKEN } }, function(error, response, body) {

          res.send(body);
        });
      });
    } else {

      res.send(body);
    }
  });
});

module.exports = router;
