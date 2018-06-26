'use strict'
const path = require('path')
const config = require('../config')
    // const ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require('../package.json');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


exports.assetsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
        config.build.assetsSubDirectory :
        config.dev.assetsSubDirectory
    return path.posix.join(assetsSubDirectory, _path)
}

exports.createNotifierCallback = function() {
    const notifier = require('node-notifier')

    return (severity, errors) => {
        if (severity !== 'error') {
            return
        }
        const error = errors[0]

        const filename = error.file.split('!').pop()
        notifier.notify({
            title: pkg.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}



exports.setDevHtmlPlugin = function(webpackConfig) {
    var htmls = config.htmls;
    var baseHTMLPath = config.baseHTMLPath;
    for (var i = 0; i < htmls.length; i++) {
        var options = {
            filename: baseHTMLPath + htmls[i].html,
            template: baseHTMLPath + htmls[i].html,
            inject: true,
            chunks: htmls[i].chunks
        };
        var newHTMLPlugin = new HtmlWebpackPlugin(options);
        webpackConfig.plugins.push(newHTMLPlugin);
    }
    return webpackConfig;
}


exports.setProductionHtmlPlugin = function(webpackConfig) {
    var htmls = config.htmls;
    var baseHTMLPath = config.baseHTMLPath;
    var templateHTMLPath = config.templateHTMLPath;
    for (var i = 0; i < htmls.length; i++) {
        var newHTMLPlugin = new HtmlWebpackPlugin({
            filename: htmls[i].dist || htmls[i].html,
            template: baseHTMLPath + htmls[i].html,
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunks: htmls[i].chunks
        });
        webpackConfig.plugins.push(newHTMLPlugin);
    }
    return webpackConfig;
}