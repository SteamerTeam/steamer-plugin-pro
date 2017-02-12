"use strict";

const path = require('path'),
	  fs = require('fs'),
      ProPlugin = require('../index');


describe("steamer-plugin-pro", function() {
  	it("=> init", function() {

        let config = require('../specPlugin/project1/.steamer/steamer-plugin-pro.js', "utf-8");

        expect(config.plugin).toBe('steamer-plugin-pro');

        expect(config.config.projects['steamer-react'].src).toBe('steamer-react');
        expect(config.config.projects['steamer-react'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-react'].cmds.dist).toBe('node ./tools/dist.js');
        
        expect(config.config.projects['steamer-simple'].src).toBe('steamer-simple');
        expect(config.config.projects['steamer-simple'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-simple'].cmds.dist).toBe('node ./tools/dist.js');
  	 
        expect(config.config.steps.start).toEqual({});
        expect(config.config.steps.dist).toEqual({});
    });

    it("=> dist", function() {

        let dist = fs.readdirSync('./specPlugin/project2/dist/');

        expect(dist[0]).toBe('cdn');
        expect(dist[1]).toBe('webserver');

        let cdn = fs.readdirSync('./specPlugin/project2/dist/cdn');

        expect(cdn[0]).toBe('react');
        expect(cdn[1]).toBe('simple');

        let webserver = fs.readdirSync('./specPlugin/project2/dist/webserver');

        expect(webserver[0]).toBe('react');
        expect(webserver[1]).toBe('simple');

    });

    it("=> level", function() {

        let config = require('../specPlugin/project3/.steamer/steamer-plugin-pro.js', "utf-8");

        expect(config.plugin).toBe('steamer-plugin-pro');

        expect(config.config.projects['steamer-project'].src).toBe('');
        expect(config.config.projects['steamer-project'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-project'].cmds.dist).toBe('node ./tools/dist.js');
        
        expect(config.config.projects['steamer-react'].src).toBe('steamer-react');
        expect(config.config.projects['steamer-react'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-react'].cmds.dist).toBe('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple'].src).toBe('steamer-simple');
        expect(config.config.projects['steamer-simple'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-simple'].cmds.dist).toBe('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple1'].src).toBe('steamer-simple/steamer-simple1');
        expect(config.config.projects['steamer-simple1'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-simple1'].cmds.dist).toBe('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple2'].src).toBe('steamer-simple/steamer-simple1/steamer-simple2');
        expect(config.config.projects['steamer-simple2'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-simple2'].cmds.dist).toBe('node ./tools/dist.js');

        expect(config.config.projects['steamer-simple3'].src).toBe('steamer-simple/steamer-simple1/steamer-simple2/steamer-simple3');
        expect(config.config.projects['steamer-simple3'].cmds.start).toBe('node ./tools/start.js');
        expect(config.config.projects['steamer-simple3'].cmds.dist).toBe('node ./tools/dist.js');
     
        expect(config.config.steps.start).toEqual({});
        expect(config.config.steps.dist).toEqual({});

    });

    it("=> dist specific project", function() {

        let dist = fs.readdirSync('./specPlugin/project3/steamer-simple/dist/');

        expect(dist[0]).toBe('cdn');
        expect(dist[1]).toBe('webserver');

        let cdn = fs.readdirSync('./specPlugin/project3/steamer-simple/dist/cdn');

        expect(cdn[0]).toBe('simple');

        let webserver = fs.readdirSync('./specPlugin/project3/steamer-simple/dist/webserver');

        expect(webserver[0]).toBe('simple');

    });

});