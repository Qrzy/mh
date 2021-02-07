module.exports = {
  apps: [
    {
      name: 'mh',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      watch: true,
      env: {
        NUXT_PORT: 80,
        NUXT_HOST: '0.0.0.0',
      },
      error_file: 'err.log',
      out_file: 'out.log',
      log_file: 'combined.log',
      time: true,
    },
  ],
};
