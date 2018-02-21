'use strict';
const chai = require('chai');
const request = require('request');
const config = require('config');

let expect = chai.expect;
let webConfig = config.get('web');
let baseUrl = `https://localhost:${webConfig.https.port}${webConfig.basePath}`
let proxyUrl = `${baseUrl}${webConfig.proxy.basePath}${webConfig.proxy.subPath}`

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('p-g-a_sample', function() {
  describe('webConfigs', function() {
    it('should not be null', function(done) {

      expect(webConfig).to.not.equal(null);
      expect(webConfig.basePath).to.not.equal(null);
      expect(webConfig.https.port).to.not.equal(null);
      expect(webConfig.proxy.basePath).to.not.equal(null);
      expect(webConfig.proxy.subPath).to.not.equal(null);
      expect(webConfig.api.host).to.not.equal(null);

      done();
    });
  });
});

describe('/p-g-a', function() {
  describe('get', function() {
    
    it('should respond with 200 Success', function(done) {
      request({
        url: baseUrl,
        method: 'GET',
      },
      function(error, res, body) {

        if (error) return done(error);

        expect(res.statusCode).to.equal(200);
        expect(body).to.not.equal(null);

        done();
      });
    });

    it('should respond with 404 Error for wrong path', function(done) {
      request({
        url: `${baseUrl}/wrong-path`,
        method: 'GET',
      },
      function(error, res, body) {

        if (error) return done(error);

        expect(res.statusCode).to.equal(404);
        expect(body).to.not.equal(null);

        done();
      });
    });

    it('should respond with 403 for missing csrf token', function(done) {
      request({
        url: `${proxyUrl}`,
        method: 'GET',
      },
      function(error, res, body) {

        if (error) return done(error);

        expect(res.statusCode).to.equal(403);
        expect(body).to.not.equal(null);
        expect(body.search('invalid csrf token')).to.not.equal(-1);

        done();
      });
    });

    it('should respond with 403 for wrong csrf token', function(done) {
      request({
        url: `${proxyUrl}?_csrf=wrongToken'`,
        method: 'GET',
      },
      function(error, res, body) {

        if (error) return done(error);

        expect(res.statusCode).to.equal(403);
        expect(body).to.not.equal(null);
        expect(body.search('invalid csrf token')).to.not.equal(-1);

        done();
      });
    });
  });
});
