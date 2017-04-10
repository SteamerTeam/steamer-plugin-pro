module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-react": {
                "src": "steamer-react",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            },
            "steamer-simple": {
                "src": "steamer-simple",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            }
        },
        "steps": {
            "start": {},
            "dist": {}
        }
    }
};