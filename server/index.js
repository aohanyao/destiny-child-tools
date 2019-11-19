import React from 'react'
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import fileUpload from 'express-fileupload'
import {exec} from 'child_process'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import httpProxy from 'http-proxy'
import config from '../webpack.config.js'
import {renderHtml} from './html.js'
import { string } from 'postcss-selector-parser'

const app = express(),
      port = 3000,
      webpackPort = port + 1,
      // __dirname = path.dirname(fileURLToPath(import.meta.url)),
      webpackProxy = httpProxy.createProxyServer({
        target: 'http://localhost:' + webpackPort,
        changeOrigin: true,
        ws: true
      })

const webpackDevServer = new WebpackDevServer(webpack(Object.assign({}, config, {
  mode: 'development'
})), {
  contentBase: path.join(__dirname, '../docs/'),
  publicPath: config.output.publicPath,
  clientLogLevel: 'warning',
  // inline: true,
  watchOptions: {
    ignored: [
      path.resolve(__dirname, '../docs/live2d'),
      path.resolve(__dirname, '../server')
    ]
  },
  hot: true,
  inline: true,
  host: 'localhost',  
  port: webpackPort,
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true
  }
})

global.__HTML__ = true

webpackDevServer.listen(webpackPort, 'localhost')

app.use(bodyParser.json({extended: true, limit: '50mb'}))
app.use(bodyParser.urlencoded())
app.use(fileUpload({limits: { fileSize: 50 * 1024 * 1024 }}))

app.get('*', (req, res) => {
  if(req.headers.accept &&
    req.headers.accept.match(/\/html/) &&
    !req.url.match(/\.[a-z]+$/) &&
    !req.url.match(/\/live2d\//)
  ) {
    res.setHeader('content-type', 'text/html')
    const body = 'OK'
    res.send(
      // fs.readFileSync(path.resolve(__dirname, '../src/index.html')).toString()
      renderHtml(req.url)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    )
  }
  else {
    req.url = req.url.replace('/destiny-child-tools', '')
    webpackProxy.web(req, res)
  }

})
app.post('/api/childs', (req, res) => {
  fs.writeFileSync(path.resolve(__dirname, '../docs/data/childs.json'),
    JSON.stringify(req.body, null, 2)
  )
  res.send(req.body)
})

app.post('/api/mod', function(req, res) {
  req.files.pck.mv(path.join(__dirname, '../pckmanager', req.files.pck.name))
  const name = req.files.pck.name.replace('.pck', '')

  const stringify = mod =>
    mod.child + '_' +
    mod.variant + '-' +
    mod.modder.toLowerCase().replace(/\s/g, '_') + '-' +
    mod.name.toLowerCase().replace(/\s/g, '_')

  const mod = {
    name: req.body.name.replace(/^\s+/m, '').replace(/\s+$/m, ''),
    swap: req.body.swap.replace(/^\s+/m, '').replace(/\s+$/m, ''),
    variant: name.replace(/^.+_/, ''),
    child: name.replace(/_.+$/, ''),
    modder: req.body.modder.replace(/^\s+/m, '').replace(/\s+$/m, '')
  }
  if(req.body.nsfw == 'nsfw') mod.nsfw = true

  function run(cmd) {
    console.log('RUNNING: ' + cmd)
    return new Promise((resolve, reject) => {
      const ls = exec(cmd)
      ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data.toString());
      })
      ls.stderr.on('data', function (data) {
        console.log('stderr: ' + data.toString())
        reject(data.toString())
      })
      ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        if(code) reject() 
        else resolve()
      })
    })
  }
  // const run = command => {
  //   exec(command)
  // }

  const pckPath = path.join(__dirname, '../pckmanager/'),
        assetPath = path.join(__dirname, '../docs/live2d/assets/'),
        modsDataPath = path.join(__dirname, '../docs/data/mods.json')

  run(`rm -rf ${pckPath}${name}`)
    .then(() => run('./pckmanager/PCK.exe /L ./pckmanager/' + name + '.pck'))
    // try to extract live2d (kr/jp only)
    .then(() => run(`rm -rf ${assetPath}${stringify(mod)}`))
    .then(() => {
      if(fs.existsSync(`${pckPath}${name}/MOC.${name}.json`)) {
        // copy extracted live2d to assets
        console.log('Live2d successfully extracted')
        return run(`mv ${pckPath}${name} ${assetPath}${stringify(mod)}`)
      }
      else {
        // copy extracted live2d to assets
        console.log('Copying existing path')
        return run(`cp -r ${assetPath}${name} ${assetPath}${stringify(mod)}`)
          .then(() => {
            let origPngName, newPngName
            fs.readdirSync(`${pckPath}${name}/`).forEach(function(file) {
              if(file.match(/.png$/)) origPngName = file
            })
            fs.readdirSync(`${assetPath}${stringify(mod)}/`).forEach(function(file) {
              if(file.match(/.png$/)) newPngName = file
            })
            return run(`cp ${pckPath}${name}/${origPngName}  ${assetPath}${stringify(mod)}/${newPngName}`)
          })
      }
    })
    // // name json file for live2d
    .then(() => run(`mv ${assetPath}${stringify(mod)}/MOC.${name}.json ${assetPath}${stringify(mod)}/MOC.${stringify(mod)}.json`))
    // create unitersal
    .then(() => run(`rm -rf ${pckPath}${name}`))
    .then(() => run('./pckmanager/PCK.exe /R /U ./pckmanager/' + name + '.pck'))
    .then(() => run(`mv ${pckPath}${name}.pck.newUnencrypted ${assetPath}${stringify(mod)}/${name}.pck`))
    .then(() => run(`rm -rf ${pckPath}${name}.pck.newUnencrypted`))
    .then(() => run(`rm -rf ${pckPath}${name}`))
    .then(() => run(`rm -rf ${pckPath}${name}`))
    .then(() => run(`rm -rf ${pckPath}${name}.pck`))
    .then(() => {
      const mods = JSON.parse(fs.readFileSync(modsDataPath))
      if(!mods.find(m => stringify(m) == stringify(mod))) {
        mods.push(mod)
        fs.writeFileSync(modsDataPath, JSON.stringify(mods, null, 2))
      }
    })
    .then(() => {
      fs.writeFileSync(path.resolve(__dirname, '../missing-previews.json'), JSON.stringify([stringify(mod)]))
    })
    .then(() => run('npx cypress run --spec=cypress/integration/previews.spec.js'))
    .then(() => run('yarn auto-crop'))
    .then(() => res.redirect(req.body.backUrl))
})

app.listen(port, () => console.log(`Development API server running on port ${port}!`))
