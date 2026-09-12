/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const { configure } = require("quasar/wrappers")
const path = require("path")

module.exports = configure(function (ctx) {
  return {
    supportTS: false,

    boot: ["axios", "pinia"],

    css: ["app.scss"],

    extras: [
      "roboto-font",
      "material-icons",
      "fontawesome-v6"
    ],

    build: {
      vueRouterMode: "hash",

      publicPath: "/",

      gzip: true,

      showProgress: true,

      transpileDependencies: [
        "quasar",
        "pinia",
        "vue-router"
      ],

      cssMinify: true,

      terserOptions: {
        compress: {
          drop_console: ctx.prod,
          drop_debugger: ctx.prod,
          pure_funcs: ctx.prod ? ["console.log", "console.info", "console.debug"] : []
        }
      },

      chainWebpack(chain) {
        chain.resolve.alias.set("@", path.resolve(__dirname, "src"))
        chain.plugin("provide").use(require("webpack").ProvidePlugin, [{
          process: "process/browser"
        }])

        // Split chunks for better caching
        chain.optimization.splitChunks({
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: 10
            },
            quasar: {
              test: /[\\/]node_modules[\\/]quasar[\\/]/,
              name: "quasar",
              chunks: "all",
              priority: 20
            },
            pinia: {
              test: /[\\/]node_modules[\\/](pinia|vue-router)[\\/]/,
              name: "pinia-router",
              chunks: "all",
              priority: 15
            },
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })
      }
    },

    devServer: {
      https: false,
      port: 8080,
      open: true,
      compress: true
    },

    framework: {
      config: {},
      lang: "ru",
      iconSet: "fontawesome-v6",

      plugins: ["Meta", "Notify", "Loading", "Dialog"],

      config: {
        brand: {
          primary: "#1976D2",
          secondary: "#424242",
          accent: "#82B1FF",
          dark: "#1E1E1E",
          positive: "#4CAF50",
          negative: "#F44336",
          info: "#2196F3",
          warning: "#FFC107"
        },
        notify: {
          position: "top",
          timeout: 3000,
          textColor: "white",
          actions: [{ icon: "close", color: "white" }]
        },
        loading: {
          color: "primary",
          size: "2rem"
        }
      },
      cssAddon: false
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      chainWebpackWebserver() {},
      middlewares: [
        ctx.prod ? "compression" : "",
        "render"
      ]
    },

    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "jsdelivr-cdn",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/api\.onrender\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ],
        manifest: {
          name: "УВЗ — Биржа труда",
          short_name: "УВЗ Работа",
          description: "Биржа труда Уралвагонзавод — вакансии, дешифратор, телефоны цехов",
          display: "standalone",
          orientation: "portrait",
          background_color: "#F5F5F5",
          theme_color: "#1976D2",
          icons: [
            { src: "icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
            { src: "icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
            { src: "icons/icon-256x256.png", sizes: "256x256", type: "image/png" },
            { src: "icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
            { src: "icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
          ]
        }
      }
    },

    cordova: {},
    capacitor: { hideSplashscreen: true },
    electron: {
      bundler: "packager",
      packager: {},
      builder: { appId: "uzv.job.exchange" },
      chainWebpackMain: () => {},
      chainWebpackPreload: () => {}
    }
  }
})