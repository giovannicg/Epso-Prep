module.exports = {
  apps: [
    {
      name: 'epso-prep-8081',
      cwd: '/Users/giovannicapote/Documents/epso-prep',
      script: 'node_modules/expo/bin/cli',
      args: 'start',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
}
