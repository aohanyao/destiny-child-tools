import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import fileUpload from 'express-fileupload'
import {exec} from 'child_process'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import httpProxy from 'http-proxy'
import {fileURLToPath} from 'url';

import {config} from '../webpack.config.js'


const app = express(),
      port = 3000,
      webpackPort = port + 1,
      webpackProxy = httpProxy.createProxyServer({
        target: 'http://localhost:' + webpackPort,
        changeOrigin: true,
        ws: true
      })

app.use('/destiny-child-tools', express.static('docs'))

app.listen(port, () => console.log(`Development API server running on port ${port}!`))
