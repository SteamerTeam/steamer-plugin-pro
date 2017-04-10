"use strict";

const path = require('path'),
	  os = require('os'),
	  fs = require('fs-extra'),
	  chalk = require('chalk'),
	  expect = require('expect.js'),
	  sinon = require('sinon'),
	  spawnSync = require('child_process').spawnSync,
	  plugin = require('../index');

const TEST = "test",
	  PROJECT = path.join(process.cwd(), TEST, "project");


describe("steamer-plugin-pro", function() {

	before(function() {

	});

	it("=> init", function() {
		process.chdir(path.join(PROJECT, "project1"));

		var pro = new plugin({
		    init: true,
		    force: true,
		});

		pro.init();

		let config = require(path.join(PROJECT, "project1/.steamer/steamer-plugin-pro.js"), "utf-8");

        expect(config.plugin).to.be('steamer-plugin-pro');

        expect(config.config.projects['steamer-react'].src).to.be('steamer-react');
        expect(config.config.projects['steamer-react'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-react'].cmds.dist).to.be('node ./tools/dist.js');
        
        expect(config.config.projects['steamer-simple'].src).to.be('steamer-simple');
        expect(config.config.projects['steamer-simple'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-simple'].cmds.dist).to.be('node ./tools/dist.js');
  	 
        expect(config.config.steps.start).to.eql({});
        expect(config.config.steps.dist).to.eql({});

	});

	it("=> init with level", function() {
		process.chdir(path.join(PROJECT, "project3"));

		var pro = new plugin({
		    init: true,
		    force: true,
		    level: 4,
		});

		pro.init();

		let config = require(path.join(PROJECT, "project3/.steamer/steamer-plugin-pro.js"), "utf-8");

        expect(config.plugin).to.be('steamer-plugin-pro');

        expect(config.config.projects['steamer-project'].src).to.be('');
        expect(config.config.projects['steamer-project'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-project'].cmds.dist).to.be('node ./tools/dist.js');
        
        expect(config.config.projects['steamer-react'].src).to.be('steamer-react');
        expect(config.config.projects['steamer-react'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-react'].cmds.dist).to.be('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple'].src).to.be('steamer-simple');
        expect(config.config.projects['steamer-simple'].cmds.start).to.be("echo 'steamer-simple dev'");
        expect(config.config.projects['steamer-simple'].cmds.dist).to.be("echo 'steamer-simple dist'");

        expect(config.config.projects['steamer-simple1'].src).to.be('steamer-simple/steamer-simple1');
        expect(config.config.projects['steamer-simple1'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-simple1'].cmds.dist).to.be('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple2'].src).to.be('steamer-simple/steamer-simple1/steamer-simple2');
        expect(config.config.projects['steamer-simple2'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-simple2'].cmds.dist).to.be('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple3'].src).to.be('steamer-simple/steamer-simple1/steamer-simple2/steamer-simple3');
        expect(config.config.projects['steamer-simple3'].cmds.start).to.be('node ./tools/start.js');
        expect(config.config.projects['steamer-simple3'].cmds.dist).to.be('node ./tools/dist.js');
     
        expect(config.config.steps.start).to.eql({});
        expect(config.config.steps.dist).to.eql({});

	});

	it("=> start", function(done) {
		this.timeout(3000);

		process.chdir(path.join(PROJECT, "project2"));

		var pro = new plugin({
		    start: true,
		});

		var infoStub = sinon.stub(pro.utils, "info");

		pro.init();

		setTimeout(() => {
			expect(infoStub.calledWith("steamer-react: \nsteamer-react dev\n")).to.be(true);
			expect(infoStub.calledWith("steamer-simple: \nsteamer-simple dev\n")).to.be(true);

			infoStub.restore();
			done();
		}, 2000);
		

	});

	it("=> start specific project", function(done) {
		this.timeout(4000);

		process.chdir(path.join(PROJECT, "project3"));

		var pro = new plugin({
		    start: "steamer-simple",
		});

		var infoStub = sinon.stub(pro.utils, "info");

		pro.init();

		setTimeout(() => {
			expect(infoStub.calledWith("steamer-simple: \nsteamer-simple dev\n")).to.be(true);

			infoStub.restore();
			done();
		}, 3000);
		

	});

	it("=> dist specific project", function(done) {
		this.timeout(4000);

		process.chdir(path.join(PROJECT, "project3"));

		var pro = new plugin({
		    dist: "steamer-simple",
		});

		var infoStub = sinon.stub(pro.utils, "info");

		pro.init();


		setTimeout(() => {
			expect(infoStub.calledWith("steamer-simple: \nsteamer-simple dist\n")).to.be(true);
			infoStub.restore();


			let dist = fs.readdirSync(path.join(PROJECT, "project3/steamer-simple/dist/"));

	        expect(dist[0]).to.be('cdn');
	        expect(dist[1]).to.be('webserver');

	        let cdn = fs.readdirSync(path.join(PROJECT, "project3/steamer-simple/dist/cdn"));

	        expect(cdn[0]).to.be('simple');

	        let webserver = fs.readdirSync(path.join(PROJECT, "project3/steamer-simple/dist/webserver"));

	        expect(webserver[0]).to.be('simple');


			done();

		}, 3000);


	});

	it("=> dist", function(done) {
		this.timeout(4000);

		process.chdir(path.join(PROJECT, "project2"));

		var pro = new plugin({
		    dist: true,
		});

		var infoStub = sinon.stub(pro.utils, "info");

		pro.init();

		setTimeout(() => {
			expect(infoStub.calledWith("steamer-react: \nsteamer-react dist\n")).to.be(true);
			expect(infoStub.calledWith("steamer-simple: \nsteamer-simple dist\n")).to.be(true);

			infoStub.restore();

			let dist = fs.readdirSync(path.join(PROJECT, "project2/dist"));

	        expect(dist[0]).to.be('cdn');
	        expect(dist[1]).to.be('webserver');

	        let cdn = fs.readdirSync(path.join(PROJECT, "project2/dist/cdn"));

	        expect(cdn[0]).to.be('react');
	        expect(cdn[1]).to.be('simple');

	        let webserver = fs.readdirSync(path.join(PROJECT, "project2/dist/webserver"));

	        expect(webserver[0]).to.be('react');
	        expect(webserver[1]).to.be('simple');

			done();
		}, 3000);
		

	});


});
