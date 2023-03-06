import { Configuration as WebpackConfiguration, EnvironmentPlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { WebWorkerPlugin } from '@shopify/web-worker/webpack';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const itkConfig = path.resolve(__dirname, 'itk.config.ts');

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const envVars = {
  ENV: undefined,
  API_HOST_ORIGIN: undefined
};

const config: Configuration = {
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  entry: './src/index.tsx',
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
            ],
            plugins: [require.resolve('react-refresh/babel')]
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
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new WebWorkerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '../../node_modules/itk-wasm/dist/web-workers',
          to: path.join(__dirname, 'dist', 'itk', 'web-workers')
        },
        {
          from: '../../node_modules/itk-image-io',
          to: path.join(__dirname, 'dist', 'itk', 'image-io')
        }
        // {
        //   from: '../../node_modules/itk-mesh-io',
        //   to: path.join(__dirname, 'dist', 'itk', 'mesh-io')
        // }
      ]
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    static: path.join(__dirname, 'build'),
    historyApiFallback: true,
    port: 3000
  }
};

export default config;
