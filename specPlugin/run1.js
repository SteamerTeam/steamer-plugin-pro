"use strict";

const path = require('path'),
	  fs = require('fs'),
	  exec = require('child_process').exec,
      ProPlugin = require('../index');



// init
process.chdir("./specPlugin/project1");

var pro = new ProPlugin({
    init: true,
    force: true,
});

pro.init();

// level
process.chdir("../project3");

var pro = new ProPlugin({
    init: true,
    level: 4,
    force: true
});

pro.init();

// dist specific project
var pro = new ProPlugin({
    dist: "steamer-simple",
});

pro.init();

