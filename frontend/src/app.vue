<template>
  <div id="app">
    <TopBar />
    <Main />
  </div>
</template>

<script>
import TopBar from './components/top.bar.vue';
import Main from './main/main.vue';

export default {
  name: 'App',
  components: {
    TopBar,
    Main
  }
}
</script>
