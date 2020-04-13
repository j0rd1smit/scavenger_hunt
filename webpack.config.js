const ip = require("ip");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = "dist";

module.exports = {
    entry: "./src/client/index.tsx",
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [ '.ts', '.tsx', ".js", ".json"],
        modules: ['node_modules', 'src'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        port: 3000,
        disableHostCheck: true,
        open: true,
        proxy: {
            "/api": "http://localhost:8080"
        },
        host: ip.address(),
        https: true,
        historyApiFallback: true,
    },
    plugins: [
        new CleanWebpackPlugin({
            "output":{
                "path": outputDirectory
            }
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
            inject : false,
        })
    ]
};
