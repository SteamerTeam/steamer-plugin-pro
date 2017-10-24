module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-react": {
                "src": "steamer-react",
                "dist": "dist",
                "cmds": {
                    "start": "echo 'steamer-react dev'",
                    "dist": "echo 'steamer-react dist'"
                }
            },
            "steamer-simple": {
                "src": "steamer-simple",
                "dist": "dist",
                "cmds": {
                    "start": "echo 'steamer-simple dev'",
                    "dist": "echo 'steamer-simple dist'"
                }
            }
        },
        "steps": {
            "start": {},
            "dist": {
                start: function(config) {       // command starts
                    console.dir("=====start=====");
                },
                finish: function(config) {      // command ends               
                    if (config.isEnd) {
                        this.copyToDist();
                    }
                }
            }
        }
    }
}