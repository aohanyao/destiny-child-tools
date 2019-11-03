const request = require('sync-request'),
      fs = require('fs'),
      path = require('path'),
      childs = require('../docs/data/childs.json')

const generateHtml = (pathname) => {
  const res = request('GET', 'http://localhost:3000/destiny-child-tools' + pathname, {
    headers: {
      'accept': 'text/html',
    },
  })
  const target = pathname == '/' ? '/index.html' : pathname + '/index.html'
  fs.mkdirSync(path.resolve(__dirname, '../docs' + pathname), { recursive: true })
  console.log('Writing HTML to', target)
  fs.writeFileSync(path.resolve(__dirname, '../docs' + target), res.getBody('utf8'))
}

generateHtml('/')
generateHtml('/childs')
Object.keys(childs).forEach(id => generateHtml('/childs/' + id))
