<template>
  <div>
    <h1>Files</h1>
    <div v-if="!loading">
      <div>
        <b-breadcrumb :items="breadcrumbs" />
      </div>
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
            <li v-for="file in files" :key="file.id">
              {{ file.name }}
            </li>
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
      type: [Number, Boolean],
      default: false
    }
  },
  data() {
    return {
      folders: [],
      files: [],
      loading: false,
      path: ''
    };
  },
  computed: {
    breadcrumbs() {
      const pathParts = this.path.split('/').filter(it => it);
      const breadcrumbs = [];
      if (pathParts.length > 0) {
        breadcrumbs.push({
          text: 'root',
          href: '/file'
        });
      }
      breadcrumbs.push(...pathParts
        .map((name, index) => ({
          text: decodeURI(name),
          href: `/file/${pathParts.slice(0, index + 1).join('/')}`
        })));
      return breadcrumbs;
    }
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
      const { folders, files } = await api.getSubfolders(this.userId, this.path);
      this.folders = folders;
      this.files = files;
      this.loading = false;
    },
    toFolder(folder) {
      return path.join('/file', this.path, folder);
    }
  }
});
</script>
