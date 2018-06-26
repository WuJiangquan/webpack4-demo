'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader", // translates CSS into CommonJS
                "sass-loader", // compiles Sass to CSS
                "postcss-loader"
            ]
        }]
    },
    mode: "production",
    devtool: config.build.devtool,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true }
        }),

        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "css/[name].[hash].css"
        })
        // copy custom static assets
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname, '../static'),
        //     to: config.build.assetsSubDirectory,
        //     ignore: ['.*']
        // }])
    ]
})

utils.setProductionHtmlPlugin(webpackConfig);

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}



module.exports = webpackConfig