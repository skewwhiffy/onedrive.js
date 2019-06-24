<template>
  <div>
    <h1>Files</h1>
    <div v-if="!loading">
      <div class="row">
        <div class="col-sm-2">
          <ul>
            <li><a :href="toFolder('..')">..</a></li>
            <li v-for="folder in folders" :key="folder.id">
              <a :href="toFolder(folder.name)">{{ folder.name }}</a>
            </li>
          </ul>
        </div>
        <div class="col-sm-10">
          <ul>
            <li>File1</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="loading">
      <h2>Loading</h2>
    </div>
  </div>
</template>

<script>
import path from 'path';
import Vue from 'vue';
import Api from '../api/api';
import UrlManipulator from '../url.manipulator';

const api = new Api();
const urlManipulator = new UrlManipulator();

export default Vue.extend({
  name: 'File',
  props: {
    userId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      folders: [],
      loading: false,
      path: ''
    };
  },
  watch: {
    async userId() {
      await this.refresh();
    }
  },
  async created() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      if (!this.userId) return;
      this.loading = true;
      this.path = urlManipulator.folderPath;
      this.folders = await api.getSubfolders(this.userId, this.path);
      this.loading = false;
    },
    toFolder(folder) {
      return path.join('/file', this.path, folder);
    }
  }
});
</script>
