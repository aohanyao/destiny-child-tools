import webpack from 'webpack'
import {config} from './webpack.config.js'

config.mode = 'production'

const bundler = webpack(config)

bundler.run()
