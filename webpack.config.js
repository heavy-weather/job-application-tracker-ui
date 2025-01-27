import * as path from 'path';
import * as url from 'url';
import autoprefixer from 'autoprefixer';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';


export default {
    entry: {
        'app': './src/main/html/app.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/main/resources/public/'),
    },
    mode,
    plugins: [
        new MiniCSSExtractPlugin(),
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.less'],
        fallback: {
            fs: false,
            path: false,
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/i,
                include: path.resolve(__dirname, 'src/main/html'),
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(tsx|ts)$/i,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                            onlyCompileBundledFiles: true
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    devtool: 'eval-source-map',
    ignoreWarnings: [
        {
            // Importing this file causes multiple warnings; ignore them
            message: /\.\/node_modules\/sass-loader\/dist\/cjs\.js/
        }
    ]
}
