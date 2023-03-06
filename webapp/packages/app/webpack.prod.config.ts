import { Configuration, EnvironmentPlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { WebWorkerPlugin } from '@shopify/web-worker/webpack';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const itkConfig = path.resolve(__dirname, 'itk.config.ts');

const envVars = {
  ENV: undefined,
  API_HOST_ORIGIN: undefined
};

const config: Configuration = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { fs: false, path: false, url: false, module: false },
    alias: {
      '../itkConfig.js': itkConfig,
      '../../itkConfig.js': itkConfig
    }
  },
  plugins: [
    new EnvironmentPlugin(envVars),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new CleanWebpackPlugin(),
    new WebWorkerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '../../node_modules/itk-wasm/dist/web-workers',
          to: path.join(__dirname, 'build', 'itk', 'web-workers')
        },
        {
          from: '../../node_modules/itk-image-io',
          to: path.join(__dirname, 'build', 'itk', 'image-io')
        }
        // {
        //   from: '../../node_modules/itk-mesh-io',
        //   to: path.join(__dirname, 'dist', 'itk', 'mesh-io')
        // }
      ]
    })
  ]
};

export default config;
