
const path = require('path');

module.exports = {
    devtool: 'eval-source-map', //source map, help to find error loaction
    
    entry:  path.resolve(__dirname, 'src') + "/index.js",//entry point

    output: {
        // For some reason, the `__dirname` was not evaluating and `/dist` was
        // trying to write files to a `dist` folder at the root of my HD.

        path: path.resolve(__dirname, 'dist'),//output directory
        publicPath: '/dist',
        filename: "bundle.js"//bundled file name
    },

    devServer: {
        // Public path refers to the location from the _browser's_ perspective, so 
        // `/public' would be referring to `mydomain.com/public/` instead of just
        // `mydomain.com`.
        contentBase: __dirname + "/public",//本地服务器所加载的页面所在的目录, 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
        port: "8081", //设置默认监听端口，如果省略，默认为”8080“
        historyApiFallback: true,//不跳转, 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        // inline: true//实时刷新, 设置为true，当源文件改变时会自动刷新页面
        watchContentBase: true,
        hot: true

    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: /node_modules/
            },

            {
                // test: /\.css$/,
                // use: [
                //     {
                //         loader: "style-loader"
                //     }, {
                //         loader: "css-loader",
                //         options: {
                //             modules: true,
                //           },
                //     }
                // ]
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                            }, // 指定启用css modules
                            
                        }
                    }
                ]
            },
        ],
    }
  }