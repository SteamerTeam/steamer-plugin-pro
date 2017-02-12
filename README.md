##  steamer-plugin-pro

多框架管理工具

### 安装

```javascript
npm i -g steamerjs

npm i -g steamer-plugin-pro
```


#### 项目结构

通常来说，会有两种的项目结构

* 兄弟结构

```javascript

Main Porject
	|---- A Project 
	|---- B Project

```

* 父子结构
	- 默认, `steamer-plugin-pro` 只会搜索到第2层

```javascript

Main Project 
	|
	|---- A Project 
	  |
	  |---- B Project

```

#### 初始化

如果你希望 `steamer-plugin-pro` 自动检测你的项目，你需要在适当改动你的子项目的 `package.json`。 下面的 `start` 和 `dist` 就是会使用到的值。

```javascript
{
  "name": "steamer-project",
  "scripts": {
  	"start": "",
  	"dist": "",
  },
}

```

下面是一个展示的例子, `steamer-plugin-pro` 会生成 `steamer-plugin-pro.js` 配置文件.

```javascript
steamer pro -i

or 

steamer pro --init

// 搜索到第4层
steamer pro -i -l 4

or

steamer pro --init --level 4

// 无论 `steamer-plugin-pro.js` 配置文件是否存在，直接覆盖
steamer pro -i -f

or

steamer pro --init --force
```

`package.json`中的 `name` 值，直接作为 `project` 的值. `package.json` 里的 `scripts`中，`start` 和 `dist`  被用于配置中的 `cmds` 值。

`src` 值，则表示子项目文件的相对位置。

```javascript
module.exports = {
    "plugin": "steamer-plugin-pro",
    "config": {
        "projects": {
            "steamer-project": {
                "src": "project",
                "cmds": {
                    "start": "",
                    "dist": ""
                }
            },
            "steamer-koa": {
                "src": "koa",
                "cmds": {
                    "start": "node-dev ./app.js",
                    "dist": ""
                }
            },
            "steamer-model": {
                "folder": "model",
                "cmds": {
                    "start": "gulp&&node ./webpack.server.js",
                    "dist": "gulp sprites&&export NODE_ENV=production&&webpack"
                }
            },
            "steamer-react": {
                "folder": "react",
                "cmds": {
                    "start": "gulp&&node ./webpack.server.js",
                    "dist": "gulp sprites&&export NODE_ENV=production&&webpack"
                }
            }
        },
        "steps": {
            "start": {},
            "dist": {}
        }
    }
}
```

#### 开发或发布你的项目

* 开发项目

```javascript
// 开发所有项目
steamer pro -s 

or 

steamer pro --start

// 只开发特定项目

steamer pro -s steamer-react

or 

steamer pro --start steamer-react
```

* 发布项目

```javascript
// 发布所有项目
steamer pro -d 

or 

steamer pro --dist

// 只发布特定项目

steamer pro -d steamer-react

or 

steamer pro --dist steamer-react
```

你也可以设置以下的回调函数，`config` 会作为参数传递到回调函数中。

* `config.currentProject`
	- 当前子进程的执行的项目

* `config.isEnd`
	- 只会在 `finish` 回调中出现, 如果是 `true`, 表示所有子进程结束

```javascript
"steps": {
    "start": {
        start: function(config) {       // 命令开始
            console.log("=====start=====");
            console.log(config);
        },
        finish: function(config) {      // 命令结束
            if (config.isEnd) {
                console.log("======end=====");
            }
        }
    },
    "dist": {
        start: function(config) {       // 命令开始
            console.log("=====start=====");
            console.log(config);
        },
        finish: function(config) {      // 命令结束
            if (config.isEnd) {
                console.log(config);
            }
        }
    }
}
```