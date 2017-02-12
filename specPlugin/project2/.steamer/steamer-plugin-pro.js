module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-react": {
                "src": "/Users/lcxfs1991/web/steamer-plugin-pro/specPlugin/project/steamer-react",
                "dist": "./dist/",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            },
            "steamer-simple": {
                "src": "/Users/lcxfs1991/web/steamer-plugin-pro/specPlugin/project/steamer-simple",
                "dist": "./dist/",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            }
        },
        "steps": {
            "start": {},
            "dist": {
                start: function(config) {       // command starts
                    console.log("=====start=====");
                    // console.log(config);
                },
                finish: function(config) {      // command ends
                    if (config.isEnd) {
                        this.copyToDist()
                    }
                }
            }
        }
    }
}