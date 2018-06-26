// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    baseHTMLPath: "./html/",
    entries: {
        main: "./static/js/controller/main.js"
    },
    htmls: [{
        html: "index.html",
        chunks: ["manifest", "vendor", "main"],
        dist: path.resolve(__dirname, "../public/index.html")
    }],
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, 'index.build.html'),
        assetsRoot: path.resolve(__dirname, '../public/static'),
        assetsSubDirectory: '',
        assetsImagesSubDirectory: '',
        assetsPublicPath: 'http://localhost:8080/static/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
        devtool: "#source-map"
    },
    dev: {
        env: require('./dev.env'),
        port: 80,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        host: "localhost",
        devtool: "cheap-module-source-map",
        proxyTable: {

        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}