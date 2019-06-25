<template>
  <div id="app">
    <TopBar />
    <Main />
  </div>
</template>

<script>
import Vue from 'vue';
import TopBar from './components/top.bar.vue';
import Main from './main/main.vue';

export default Vue.extend({
  name: 'App',
  components: {
    TopBar,
    Main
  }
});
</script>
