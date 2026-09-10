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
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: ["axios", "pinia"],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      "app.scss",
      "styles/design-system.css"
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      "roboto-font",
      "material-icons",
      "fontawesome-v6",
      // Google Fonts - Inter & JetBrains Mono
      "@fontsource/inter",
      "@fontsource/jetbrains-mono"
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: "hash",

      // transpile: false,
      // publicPath: '/',

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: true, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack(chain) {
        chain.resolve.alias.set("@", path.resolve(__dirname, "src"))
        chain.plugin("provide").use(require("webpack").ProvidePlugin, [{
          process: "process/browser"
        }])
      },

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true,
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {},
      lang: "ru",
      // iconSet: 'material-icons',
      // lang: 'en-US',

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      // components: [],
      // directives: [],

      // Quasar plugins
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
      // Disable default Quasar CSS injection since we have our design system
      cssAddon: false
    },

    // animations: 'all',
    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-animations
    animations: ["fadeIn", "slideUp", "slideDown", "scale"],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

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

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
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

    // https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true,
    },

    // https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: "packager",

      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        appId: "uzv.job.exchange",
      },

      chainWebpackMain(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },

      chainWebpackPreload(/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
      },
    },
  };
});