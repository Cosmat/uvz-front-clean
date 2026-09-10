/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const { configure } = require("quasar/wrappers");
const path = require("path");

module.exports = configure(function (ctx) {
  return {
    supportTS: false,

    boot: ["axios", "pinia"],

    css: [
      "app.scss",
      "assets/styles/design-system.css"
    ],

    extras: [
      "roboto-font",
      "material-icons",
      "fontawesome-v6"
    ],

    build: {
      vueRouterMode: "hash",

      chainWebpack(chain) {
        chain.resolve.alias.set("@", path.resolve(__dirname, "src"))
        chain.plugin("provide").use(require("webpack").ProvidePlugin, [{
          process: "process/browser"
        }])
      },
    },

    devServer: {
      https: false,
      port: 8080,
      open: true,
    },

    framework: {
      config: {},
      lang: "ru",

      plugins: ["Meta", "Notify", "Loading", "Dialog"],

      config: {
        brand: {
          primary: "#2563eb",
          secondary: "#16a34a",
          accent: "#f59e0b",
          danger: "#ef4444",
          dark: "#1e293b",
          positive: "#16a34a",
          negative: "#ef4444",
          info: "#3b82f6",
          warning: "#f59e0b"
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

    ssr: {
      pwa: false,

      prodPort: 3000,

      maxAge: 1000 * 60 * 60 * 24 * 30,

      chainWebpackWebserver(/* chain */) {
        //
      },

      middlewares: [
        ctx.prod ? "compression" : "",
        "render",
      ],
    },

    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {},

      chainWebpackCustomSW(/* chain */) {
        //
      },

      manifest: {
        name: `УВЗ — Биржа труда`,
        short_name: `УВЗ Работа`,
        description: `Биржа труда Уралвагонзавод — вакансии, дешифратор, телефоны цехов`,
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      bundler: "packager",

      packager: {},

      builder: {
        appId: "uzv.job.exchange",
      },

      chainWebpackMain(/* chain */) {},

      chainWebpackPreload(/* chain */) {},
    },
  };
});