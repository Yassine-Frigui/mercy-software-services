module.exports = {
  apps: [
    {
      name: 'mss-backend',
      script: 'server.js',
      cwd: '/home/ubuntu/mercy-software-services/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5001,
        HOST: '0.0.0.0',
        FRONTEND_URL: 'https://mercy-software-services.duckdns.org'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/home/ubuntu/mercy-software-services/backend/logs/err.log',
      out_file: '/home/ubuntu/mercy-software-services/backend/logs/out.log',
      log_file: '/home/ubuntu/mercy-software-services/backend/logs/combined.log'
    }
  ]
};
