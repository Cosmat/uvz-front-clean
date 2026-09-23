<template>
  <div class="empty-layout">
    <router-view></router-view>
  </div>
</template>

<script>
// No Vuex here: the app runs on Pinia. Rendering a Vuex-dependent component
// (useStore() with no installed Vuex store) crashed the whole layout,
// leaving login/register/profile pages as a blank screen.
export default {
  name: "EmptyLayout",
};
</script>
