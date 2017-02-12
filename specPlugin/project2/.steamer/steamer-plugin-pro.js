module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-react": {
                "src": "steamer-react",
                "dist": "dist",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            },
            "steamer-simple": {
                "src": "steamer-simple",
                "dist": "dist",
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