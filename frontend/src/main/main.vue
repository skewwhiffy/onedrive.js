<template>
  <div>
    <b-tabs v-model="activeTabIndex" @input="tabChange">
      <b-tab title="Users">
        <User @setUserId="setUserId" />
      </b-tab>
      <b-tab title="Files">
        <File v-if="userId" :user-id="userId" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Vue from 'vue';
import User from './user.vue';
import File from './file.vue';
import UrlManipulator from '../url.manipulator';

const urlManipulator = new UrlManipulator();
const tabs = ['user', 'file'];

export default Vue.extend({
  name: 'Main',
  components: { User, File },
  data() {
    return {
      activeTabIndex: 0,
      userId: false
    };
  },
  created() {
    this.refreshActiveTabFromUrl();
  },
  methods: {
    tabChange(index) {
      const newRoute = tabs[index];
      urlManipulator.tab = newRoute;
    },
    refreshActiveTabFromUrl() {
      if (tabs.includes(urlManipulator.tab)) {
        this.activeTabIndex = tabs.indexOf(urlManipulator.tab);
      }
    },
    setUserId(userId) {
      this.userId = userId;
    }
  }
});
</script>
