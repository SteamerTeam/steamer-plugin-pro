module.exports = {
    "plugin": "steamer-plugin-ak",
    "config": {
        "zipFileName": "dist/offline",
        "src": "dist",
        "dest": "dist",
        "map": [
            {
                "src": "webserver",
                "dest": "",
                "url": "//huayang.qq.com/"
            },
            {
                "src": "cdn",
                "dest": "",
                "url": "//s1.url.cn/"
            }
        ]
    }
}