const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const pxtorem = require('postcss-pxtorem');

module.exports = {
    entry: {
        main: path.join(__dirname, '../src/index.js'), // 入口文件
        vendor: [
            'react',
            'react-dom',
            'react-router-dom',
        ], // 分离第三方库
    },
    output: {
        filename: '[name].[chunkhash:5].js', // 打包后的文件名
        chunkFilename: '[name].[chunkhash:5].js',
        path: path.join(__dirname, '../build'), // 打包后的文件存储位置
        // publicPath: '/' //此处上线部署再改，对应的是服务器上存储打包后文件的路径
    },

    resolve: {
        modules: [path.join(__dirname, '../node_modules')], // 优化webpack文件搜索范围
        mainFields: ['jsnext:main', 'main'], // 优化支持tree-shaking的库
        extensions: ['.web.js', '.jsx', '.js', '.json'],
    },

    // devtool: 'cheap-module-eval-source-map',//生产环境需关闭该功能,否则打包后体积会变大

    module: {
        rules: [{
            test: /\.js$/,
            use: ['babel-loader', 'eslint-loader'], // 编译js文件的loader,
            exclude: /node_modules/,
        },
        {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                use: [
                    'css-loader?minimize=true&modules&localIdentName=[local]-[hash:base64:5]',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer, pxtorem({
                                rootValue: 75,
                                propWhiteList: [],
                            })],
                        },
                    },
                ],
                fallback: 'style-loader',
            }),
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            include: /node_modules/,
            exclude: path.join(__dirname, '../node_modules/antd-mobile'),
        },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [autoprefixer, pxtorem({
                            rootValue: 75,
                            propWhiteList: [],
                        })],
                    },
                },
            ],
            include: path.join(__dirname, '../node_modules/antd-mobile'),
        },
        {
            test: /\.less$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                use: [
                    'css-loader?minimize=true&modules&localIdentName=[local]-[hash:base64:5]',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer, pxtorem({
                                rootValue: 75,
                                propWhiteList: [],
                            })],
                        },
                    },
                    'less-loader',
                ],
                fallback: 'style-loader',
            }),
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                use: [
                    'css-loader?minimize=true&modules&localIdentName=[local]-[hash:base64:5]',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [autoprefixer, pxtorem({
                                rootValue: 75,
                                propWhiteList: [],
                            })],
                        },
                    },
                    'sass-loader',
                ],
                fallback: 'style-loader',
            }),
        },
        {
            test: /\.(jpg|jpeg|png|gif|svg|webm|otf|webp)$/,
            loaders: [
                'url-loader?limit=1024000&name=images/[name]-[hash:5].[ext]',
                {
                    loader: 'image-webpack-loader',
                    options: {
                        gifsicle: {
                            interlaced: false,
                        },
                        optipng: {
                            optimizationLevel: 7,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4,
                        },
                        mozjpeg: {
                            progressive: true,
                            quality: 65,
                        },
                        webp: {
                            quality: 75,
                        },
                    },
                },
            ],
        },
        {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'file-loader?name=font/[name]-[hash:5].[ext]',
        },
        {
            test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'file-loader?name=font/[name]-[hash:5].[ext]',
        },
        ],
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(), // 报错时不退出webpack进程
        new webpack.optimize.ModuleConcatenationPlugin(), // 开启webpack3范围提升
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"', // 用于区分开发和生产环境
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false, // 最紧凑的输出
            comments: false, // 删除注释
            compress: {
                warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                drop_console: true, // 删除所有console语句
                collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
            },
        }),
        new HtmlWebpackPlugin({ // 自动生成html
            template: path.join(__dirname, '../src/assets/index.html'),
            chunksSortMode: 'dependency',
        }),
        new ExtractTextPlugin({
            filename: (getPath) => getPath('[name].[contenthash].css').replace('dist/js', 'css'),
            allChunks: true,
        }), // 提取css文件
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest'], // 指定公共 bundle 的名字,加manifest防止vendor的hash值改变。
        }),
        new Visualizer(), // 打包后可生成一个html文件,直接打开可看到打包文件的具体信息(包含各个模块的比重)
    ],
};
