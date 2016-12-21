### steamer-plugin-pro

manage projects with multiple framework / building tools


#### Installation

```javascript
npm i -g steamerjs

npm i -g steamer-plugin-pro
```


#### Project Structure

Generally, there are two types of structure:

* Brother Relationship Structure

```javascript

Main Porject
	|---- A Project 
	|---- B Project

```

* Parent-Child Relationship Structure
	- by default, steamer search folders in depth 2

```javascript

Main Project 
	|
	|---- A Project 
	  |
	  |---- B Project

```

#### Initialization

If you hope `steamer-plugin-pro` can detect your project, you have to place `package.json` in your project folder. The following 2 fields will be used in plugin config.

```javascript
{
  "name": "steamer-project",
  "scripts": {
  	"start": "",
  	"build": "",
  },
}

```

Here is an example plugin config (.steamer/steamer-plugin-pro.js). When you use the following command, `steamer-plugin-pro` will generate the config file.

```javascript
steamer pro -i

or 

steamer pro --init

// search deeper folders
steamer pro -i -d 4

or

steamer pro --init -depth 4

// init the config no matter previous config file is created or not
steamer pro -i -f

or

steamer pro --init --force
```

`name` is used as `project` key. `start` and `build` in `scripts` is used for `cmds` in config.
`folder` value will be generated for you. 

```javascript
module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-project": {
                "folder": "/Users/xxx/web/project",
                "cmds": {
                    "start": "",
                    "build": ""
                }
            },
            "steamer-koa": {
                "folder": "/Users/xxx/web/project/koa",
                "cmds": {
                    "start": "node-dev ./app.js",
                    "build": ""
                }
            },
            "steamer-model": {
                "folder": "/Users/xxx/web/project/model",
                "cmds": {
                    "start": "gulp&&node ./webpack.server.js",
                    "build": "gulp sprites&&export NODE_ENV=production&&webpack"
                }
            },
            "steamer-react": {
                "folder": "/Users/xxx/web/project/react",
                "cmds": {
                    "start": "gulp&&node ./webpack.server.js",
                    "build": "gulp sprites&&export NODE_ENV=production&&webpack"
                }
            }
        },
        "steps": {
            "start": {},
            "build": {}
        }
    }
}
```

#### Start or Build Your Project

* start project

```javascript
// for all projects
steamer pro -s 

or 

steamer pro --start

// for specific project

steamer pro -s steamer-react

or 

steamer pro --start steamer-react
```

* build project

```javascript
// for all projects
steamer pro -b 

or 

steamer pro --build

// for specific project

steamer pro -b steamer-react

or 

steamer pro --build steamer-react
```

You can also set the following callbacks in config file. A `config` object will be passed as parameter.

* `config.currentProject`
	- current project in current process

* `config.isEnd`
	- only shows in `finish` callback, if is `true`, it means all processes reach end

```javascript
"steps": {
    "start": {
        start: function(config) {       // command starts
            console.log("=====start=====");
            console.log(config);
        },
        finish: function(config) {      // command ends
            if (config.isEnd) {
                console.log("======end=====");
            }
        }
    },
    "build": {
        start: function(config) {       // command starts
            console.log("=====start=====");
            console.log(config);
        },
        finish: function(config) {      // command ends
            if (config.isEnd) {
                console.log(config);
            }
        }
    }
}
```