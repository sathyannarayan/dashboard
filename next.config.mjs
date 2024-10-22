/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    optimizeCss: false, // This disables CSS optimization
    compiler: {
      styledComponents: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    webpack: (config, { dev, isServer }) => {
      // This will apply to both development and production builds
      if (!dev) {
        // Disable minimization for production builds
        config.optimization.minimize = false;
        config.optimization.minimizer = [];
      }
  
      // Disable the default behavior of treating .js files as ES modules
      config.module.rules.push({
        test: /\.js$/,
        type: 'javascript/auto',
      });
  
      // Disable code splitting for client-side bundles
      if (!isServer) {
        config.optimization.splitChunks = {
          cacheGroups: {
            default: false,
          },
        };
        config.optimization.runtimeChunk = false;
      }
  
      // Disable CSS minification (keeping your existing configuration)
      if (!dev && !isServer) {
        config.optimization.minimizer = config.optimization.minimizer.filter(
          (minimizer) => minimizer.constructor.name !== 'CssMinimizerPlugin'
        );
      }
  
      return config;
    },
  };
  
  export default nextConfig;