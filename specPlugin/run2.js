"use strict";

const path = require('path'),
	  fs = require('fs'),
	  exec = require('child_process').exec,
      ProPlugin = require('../index');

// dist
process.chdir("./specPlugin/project2");

var pro = new ProPlugin({
    dist: true,
});

pro.init();