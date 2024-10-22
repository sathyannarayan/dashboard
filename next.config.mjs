const nextConfig = {
    reactStrictMode: true,
    optimizeCss: false, // This disables CSS optimization
    compiler: {
      styledComponents: true,
    },
    webpack: (config, { dev, isServer }) => {
      // Disable CSS minification
      if (!dev && !isServer) {
        config.optimization.minimizer = config.optimization.minimizer.filter(
          (minimizer) => minimizer.constructor.name !== 'CssMinimizerPlugin'
        );
      }
      return config;
    },
  };
  
  export default nextConfig;
