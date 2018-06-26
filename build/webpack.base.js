var path = require('path')
var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production';


function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: config.entries,
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath: isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    module: {
        rules: [{
            test: "/\.js$/",
            use: ["babel-loader"],
            include: [resolve('src'), resolve('test')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            use: [{
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                            enabled: true,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                            quality: 75
                        }
                    }
                },
                {
                    loader: "url-loader",
                    options: {
                        limit: 1000,
                        name: utils.assetsPath('img/[name].[hash:7].[ext]')
                    }
                }
            ]
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 20000,
                name: utils.assetsPath('media/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 20000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.html$/,
            use: {
                loader: 'html-loader'
            }
        }]
    }
}