module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-project": {
                "src": "",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            },
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
            },
            "steamer-simple1": {
                "src": "steamer-simple/steamer-simple1",
                "cmds": {
                    "start": "node ./tools/start.js",
                    "dist": "node ./tools/dist.js"
                }
            },
            "steamer-simple2": {
                "src": "steamer-simple/steamer-simple1/steamer-simple2",
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
}