'use strict';

const SteamerPlugin = require('steamer-plugin'),
    fs = require('fs-extra'),
    exec = require('child_process').exec,
    _ = require('lodash'),
    path = require('path');

function emptyFunc() {}

class ProPlugin extends SteamerPlugin {
    constructor(args) {
        super(args);
        this.argv = args;
        this.config = null;
        this.tmpConfig = {};   // temporary config
        this.processCount = 0; // child process count
        this.pluginName = 'steamer-plugin-pro';
        this.description = 'manage multiple project';
    }

    init() {
        let argv = this.argv;

        this.readPluginConfig();

        if (argv.i || argv.init) {
            this.config = {
                projects: {},
                steps: { // callback
                    start: {}, // npm start callback
                    dist: {}, // npm run dist callback
                }
            };
            let dirs = ['./'],
                depth = argv.l || argv.level;
            depth = (depth && depth !== true) ? depth : 2;

            this.createPluginConfig(dirs, depth);
        }
        else if (argv.s || argv.start) {
            this.start();
        }
        else if (argv.d || argv.dist) {
            this.dist();
        }
    }

    /**
     * [walk through folders]
     * @param  {Array} dirPath  [folders need to be walked through]
     * @return {Arrays}         [filtered folders]
     */
    walkDir(dirPath) {
        let dirs = fs.readdirSync(dirPath);

        dirs = dirs.filter((item) => {
            let idDirectory = fs.lstatSync(path.join(dirPath, item)).isDirectory();
            return item !== 'node_modules' && item !== '.git' && item !== '.steamer' && idDirectory;
        });

        dirs = dirs.map((item) => {
            return path.join(dirPath, item);
        });

        return dirs;
    }

    /**
     * [read package.json to judge whether this is a project]
     * @param  {Array} dirs [potential project dirs]
     */
    readPkgJson(dirs) {
        dirs.map((item) => {
            let projectPath = path.resolve(item),
                pkgJsonPath = path.join(projectPath, 'package.json');

            if (fs.existsSync(pkgJsonPath)) {

                let pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
                this.config.projects[pkgJson.name] = {
                    src: path.relative(path.resolve(), projectPath),
                    cmds: {
                        start: pkgJson.scripts.start || '',
                        dist: pkgJson.scripts.dist || ''
                    }
                };
            }
        });
    }

    /**
     * [create config]
     */
    createPluginConfig(dirs, d) {

        let depth = d,
            nextDirs = [];

        this.readPkgJson(dirs);

        dirs.map((item) => {
            nextDirs = this.walkDir(item);
            if (depth > 0) {
                this.createPluginConfig(nextDirs, depth - 1);
            }
        });

        if (depth === 1) {
            let isForce = (this.argv.f || this.argv.force) ? true : false;

            this.createConfig(this.config, {
                overwrite: isForce,
            });
        }
    }

    /**
     * [read config]
     */
    readPluginConfig() {
        this.config = this.readConfig();
    }

    /**
     * [start command]
     */
    start() {
        let subProject = this.argv.s || this.argv.start;
        subProject = (subProject && subProject !== true) ? subProject : null;
        this.runCommand('start', subProject);
    }

    /**
     * [dist command]
     */
    dist() {
        let subProject = this.argv.d || this.argv.dist;
        subProject = (subProject && subProject !== true) ? subProject : null;
        this.runCommand('dist', subProject);
    }

    runCommand(cmdType, subProject) {

        if (!this.config) {
            throw new Error('Config file is not found.');
        }

        let projectConfig = this.config.projects || {},
            projects = Object.keys(projectConfig) || [],
            projectFolder = [],
            projectCmds = [];

        // only for a subproject
        if (subProject) {
            projects = projects.filter((item) => {
                return (item === subProject);
            });
        }

        projects.map((item) => {
            let project = projectConfig[item];

            projectFolder.push(path.resolve(project.src));
            projectCmds.push(project.cmds[cmdType]);
        });

        projectFolder.map((cwd, key) => {
            let cmd = projectCmds[key];

            let stepFinish = emptyFunc;

            if (this.config.steps && this.config.steps[cmdType]) {
                stepFinish = this.config.steps[cmdType].finish || emptyFunc;
            }

            this.runningProcess({
                projects,
                projectFolder,
                projectCmds,
                cmdType,
                cmd,
                key,
                cwd, // current working directory of the process
            }, stepFinish).bind(this)();
        });
    }

    runningProcess(opt, cb) {

        let projects = opt.projects,
            cmdType = opt.cmdType,
            cmd = opt.cmd,
            key = opt.key,
            cwd = opt.cwd;

        return () => {

            let childProcess = exec(cmd, {
                cwd: cwd,
                shell: true,
            }, (error) => {
                if (error) {
                    this.error(error);
                }
            });

            this.tmpConfig[childProcess.pid] = _.merge({
                currentProject: projects[key],
            }, this.config);

            if (this.config.steps && this.config.steps[cmdType]) {
                let stepStart = this.config.steps[cmdType].start || emptyFunc;
                stepStart.bind(this)(this.tmpConfig[childProcess.pid]);
            }

            childProcess.stdout.on('data', (data) => {
                this.info(projects[key] + ': \n' + data);
            });

            childProcess.stderr.on('data', (data) => {
                this.error(projects[key] + ': \n' + data);
            });

            childProcess.on('exit', (code) => {
                // count whether all child processes reach the end
                this.processCount++;
                this.tmpConfig[childProcess.pid].isEnd = (this.processCount === projects.length) ? true : false;

                // keep config state
                cb.bind(this)(this.tmpConfig[childProcess.pid]);
                this.info(projects[key] + ': \n child process exited with code ' + code);

                if (this.processCount === projects.length) {
                    this.processCount = 0;
                    this.tmpConfig = {};
                }

            });

        };
    }

    copyToDist() {
        let projectConfig = this.config.projects || {},
            projects = Object.keys(projectConfig) || [];

        projects.map((item) => {
            let dist = projectConfig[item].dist || '',
                distPath = path.resolve(dist);

            fs.removeSync(distPath);

        });

        projects.map((item) => {
            let dist = projectConfig[item].dist || '',
                src = projectConfig[item].src || '',
                srcPath = path.resolve(src, 'dist'),
                distPath = path.resolve(dist);

            if (fs.existsSync(srcPath)) {
                fs.copySync(srcPath, distPath);
            }

        });
    }

    /**
     * [help]
     */
    help() {
        this.printUsage('multiple framework management', 'pro');
        this.printOption([
            {
                option: 'init',
                alias: 'i',
                value: '[--level|-l] [level number] [--force|-f]',
                description: 'initialize projects config'
            },
            {
                option: 'start',
                alias: 's',
                description: 'start developing projects'
            },
            {
                option: 'dist',
                alias: 'd',
                description: 'start publish projects'
            }
        ]);
    }
}

module.exports = ProPlugin;