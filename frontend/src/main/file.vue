<template>
  <div>
    <h1>Files</h1>
    <div v-if="!loading">
      <ul>
        <li v-for="folder in folders" @click="toFolder(folder.name)" :key="folder.id">
          {{ folder.name }}
        </li>
      </ul>
    </div>
    <div v-if="loading">
      <h2>Loading</h2>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Api from '../api/api';
import UrlManipulator from '../url.manipulator';

const api = new Api();
const urlManipulator = new UrlManipulator();

export default Vue.extend({
  props: ['userId'],
  data() {
    return {
      folders: [],
      loading: false,
      path: ''
    }
  },
  name: 'File',
  async created() {
    await this.refreshFolders();
  },
  watch: {
    async userId(userId) {
      await this.refreshFolders();
    },
    $route() {
      console.log('Route change');
    }
  },
  methods: {
    async refreshFolders() {
      if (!this.userId) return;
      console.log('Refershing folders to ', urlManipulator.folderPath);
      this.loading = true;
      this.path = urlManipulator.folderPath;
      this.folders = await api.getSubfolders(this.userId, this.path);
      this.loading = false;
    },
    async toFolder(folder) {
      urlManipulator.folderPath = `${this.path}/${folder}`;
      await this.refreshFolders();
    }
  }
});
</script>
