const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


function FileChanges(options){
    this.options = options;
}
FileChanges.prototype.apply = function(compiler){
    var self = this;
    let afterEmit  = (compilation, callback)=>{
        let options = compiler.options;
        let stats = compilation.getStats().toJson({
            hash: true,
            publicPath: true,
            assets: true,
            chunks: false,
            modules: false,
            source: false,
            errorDetails: false,
            timings: false
        })
        let assetPath = (stats.publicPath && self.options.fullPath) ? stats.publicPath : '';
        let assetsByChunkName = stats.assetsByChunkName
        let seenAssets = {}
        let chunks = Object.keys(assetsByChunkName)
        chunks.push('')// push "unamed" chunk
        callback();
    }
    if (compiler.hooks){
        var plugin = {name: 'FileChanges'}
        compiler.hooks.afterEmit.tapAsync(plugin,afterEmit)
        compiler.hooks.done.tapAsync(plugin,(compilation, callback)=>{
            callback();
        })
    }else{
        compiler.plugin('after-emit',afterEmit)
    }
}

const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules : [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader", // compiles Sass to CSS
                    "postcss-loader"
                ]
            }
        ]
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
        new webpack.ProgressPlugin(true),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "css/[name].[hash].css"
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }]),
         new HtmlWebpackPlugin({
              filename: config.build.index,
              template: resolve('index.html'),
              inject: true, // 允许注入打包文件
              minify: {
                removeComments: true, // 删除注释
                collapseWhitespace: true, // 折叠空白区域
                removeAttributeQuotes: true // 尽可能删除属性周围的引号
              },
              chunksSortMode: 'dependency' // 允许控制chunk的排序在插入到HTML之前
        }),
        new FileChanges({
            url : "http://localhost/",
            params : {

            }
        })
    ]
})

// utils.setProductionHtmlPlugin(webpackConfig);

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
