var fs = require('fs');
var path = require('path');
var http_get = require('http-get');
var qiniu = require('qiniu');
var async = require('async');
var mkdirp = require('mkdirp');

var config;

mkdirp.sync(getHome());

function getHome() {
  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  return path.join(home, '.src2qiniu');
}

function uptoken() {
  var putPolicy = new qiniu.rs.PutPolicy(config.bucket);
  return putPolicy.token();
}

function uploadFile(localFile, cb) {
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken(), null, localFile, extra, function(err, ret) {
    if (err) {
      return cb(err);
    }
    cb(null, 'http://' + config.bucket + '.qiniudn.com/' + ret.hash);
  });
}

function downloadFile(src, cb) {
  var filePath = path.join(getHome(), getRandomName());
  http_get.get(src, filePath, function(err, result) {
    if (err) {
      return cb(err)
    }
    cb(null, filePath);
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomName() {
  return new Date().getTime().toString() + getRandomInt(0, 10000);
}

exports.init = function(options) {
  config = options;
  qiniu.conf.ACCESS_KEY = config.accessKey;
  qiniu.conf.SECRET_KEY = config.secretKey;
}

exports.transfer = function(src, cb) {
  async.waterfall([

    function download(done) {
      downloadFile(src, done);
    },
    function upload(filePath, done) {
      uploadFile(filePath, function(err, url) {
        fs.unlinkSync(filePath);
        done(err, url)
      });
    }
  ], function(err, url) {
    cb(err, url);
  })
}