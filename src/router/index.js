// import { router } from "app/server/app";
import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "stores/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* {, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });
  Router.beforeEach((to, from, next) => {
    const requireAuth = to.meta.auth;
    let isAuth = false;
    try {
      isAuth = !!useAuthStore().isAuthenticated;
    } catch (e) {
      // Pinia not ready yet for some reason — fall back to the stored token
      isAuth = !!localStorage.getItem("token");
    }
    if (requireAuth && !isAuth) {
      next("/login?message=auth");
    } else {
      next();
    }
  });

  // If the browser still holds an old app.js, it may request chunk files that
  // no longer exist on the server (the SPA fallback then returns HTML, the
  // script fails to parse, and the page goes blank). Reload once to pick up
  // the fresh deployment instead of showing an empty screen.
  Router.onError((error) => {
    const msg = String((error && error.message) || "");
    const chunkFailed = /Loading chunk|Loading CSS chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
      msg
    );
    if (!chunkFailed) return;
    const KEY = "chunk-reload-at";
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last > 10000) {
      sessionStorage.setItem(KEY, String(Date.now()));
      window.location.reload();
    }
  });

  return Router;
});
