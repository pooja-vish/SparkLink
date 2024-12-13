const config = {
    development: {
      apiBaseUrl: 'http://localhost:5500',
    },
    production: {
      apiBaseUrl: 'http://sparklink.cs.uwindsor.ca',
    },
  };
  
  const environment = process.env.NODE_ENV || 'development';
  
  export const API_URL = config[environment].apiBaseUrl;