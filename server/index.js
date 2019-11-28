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
import mods from '../docs/data/mods.json'
import childs from '../docs/data/childs.json'
import LZUTF8 from 'lzutf8'
import stringifyMod from '../src/lib/stringify-mod'

const modStr = mods.map((m, i) => i).join(','),
      compressed = LZUTF8.compress(modStr, {outputEncoding: 'Base64'}),
      decompressed = LZUTF8.decompress(compressed, {inputEncoding: 'Base64'})



console.log('childs', Object.keys(childs).length)
console.log('mods', mods.length)
console.log(modStr.length, 'VS', compressed.length, 'back to', decompressed.length)
// console.log(modStr)
// console.log(encodeURIComponent(compressed))

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
    modder: req.body.modder.replace(/^\s+/m, '').replace(/\s+$/m, ''),
    added: Date.now()
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
    .then(() => run('python3 ./tools/pck-tools/pckexe.py -u -m ./pckmanager/' + name + '.pck')) // try KR key
    .then(() => {
      const stillEncrypted = fs.readdirSync(path.resolve(__dirname, '../pckmanager/' + name)).reduce((acc, file) => {
        return file.match(/00000000|00000001|00000002/) || acc
      }, false)
      if(stillEncrypted) { // try global key if kr key didn't work
        return run('KEY_REGION=global python3 ./tools/pck-tools/pckexe.py -u -m ./pckmanager/' + name + '.pck')
      }
      else return true
    })
    .then(() => run(`python3 ./tools/pck-tools/pckexe.py -p ${pckPath}${name}/_header`))
    .then(() => run(`mv ${pckPath}${name}/model.json ${pckPath}${name}/MOC.${stringify(mod)}.json`)) // name json file for live2d
    .then(() => run(`rm -rf ${assetPath}${stringify(mod)}`))  // delete existing mod folder if it exists
    .then(() => run(`mv ${pckPath}${name} ${assetPath}${stringify(mod)}`)) // move extracted files to new mod folder
    .then(() => run(`unlink ./pckmanager/${name}.pck`))
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
