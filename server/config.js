import path from 'path'
export const {
  DB_USERNAME = 'admin',
  DB_PASSWORD = '1qaz2wsx',
  DB_HOST = 'ds249623.mlab.com',
  DB_PORT = '49623',
  DB_NAME = 'chatapp',
  NODE_ENV = 'develop',
  PORT = 4000,
  SECRET = 'secret',
  HTML_PATH = path.join(__dirname, '..', 'build', 'index.html'),
  BUILD_PATH = path.join(__dirname, '..', 'build')
} = process.env

export const IN_PROD = NODE_ENV === 'production'
