const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: "development",
    devtool: 'inline-source-map',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: "./index.html",
    }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "src/components", to: "scripts"},
                {from: "static/images", to: "images"},
                {from: "./node_modules/admin-lte/dist/css/adminlte.min.css", to: "styles"},
                {from: "./node_modules/admin-lte/dist/js/adminlte.min.js", to: "scripts"},
                {from: "./node_modules/admin-lte/plugins/jquery/jquery.min.js", to: "scripts"},
                {from: "./node_modules/admin-lte/plugins/chart.js/Chart.min.css", to: "styles"},
                {from: "./node_modules/admin-lte/plugins/chart.js/Chart.min.js", to: "scripts"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};