'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const https = require('https');
const helmet = require('helmet');
const forceSSL = require('express-force-ssl');
const config = require('config');

const index = require('./routes/index');
const proxy = require('./routes/proxy');

let webConfig = config.get('web');

let app = express();

let httpsServer = https.createServer({key: webConfig.https.key, cert: webConfig.https.pub}, app);
httpsServer.listen(webConfig.https.port);

app.set("forceSSLOptions", { httpsPort: webConfig.https.port });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(forceSSL);

app.use(webConfig.basePath, favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(webConfig.basePath, express.static(path.join(__dirname, 'public')));

app.use(webConfig.basePath, index);
app.use(`${webConfig.basePath}${webConfig.proxy.basePath}`, proxy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
