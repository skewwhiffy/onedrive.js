<template>
  <div>
    <h1>Files</h1>
    <div>
      <b-breadcrumb :items="breadcrumbs" />
    </div>
    <div class="row">
      <div class="col-sm-2">
        <ul class="folder-list">
          <li v-if="folders.length === 0">
            No folders
          </li>
          <li v-for="folder in folders" :key="folder.id" class="text-truncate">
            <a :href="toFolder(folder.name)">
              <font-awesome-icon icon="folder-open" />
              {{ folder.name }}
            </a>
          </li>
        </ul>
      </div>
      <div class="col-sm-10">
        <ul class="file-list">
          <li v-for="file in files" :key="file.id">
            <font-awesome-icon icon="file" />
            {{ file.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import path from 'path';
import Vue from 'vue';
import Api from '../api/api';
import UrlManipulator from '../url.manipulator';

const api = new Api();
const urlManipulator = new UrlManipulator();

export default Vue.extend({
  name: 'File',
  components: { FontAwesomeIcon },
  props: {
    userId: {
      type: [Number, Boolean],
      default: false
    },
    userStatus: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      folders: [],
      files: [],
      path: '',
      refreshInterval: 0,
      nextPoll: false
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
    },
    async userStatus() {
      switch (this.userStatus) {
        case 'onedriveSync':
          this.refreshInterval = 5;
          break;
        case 'localSync':
          this.refreshInterval = 30;
          break;
        default:
          this.refreshInterval = 0;
      }
    }
  },
  async created() {
    this.refresh();
    this.poll();
  },
  async destroyed() {
    this.refreshInterval = -1;
  },
  methods: {
    async refresh() {
      if (!this.userId) return;
      this.path = urlManipulator.folderPath;
      const { folders, files } = await api.getSubfolders(this.userId, this.path);
      this.folders = _.sortBy(folders, it => it.name);
      this.files = _.sortBy(files, it => it.name);
    },
    toFolder(folder) {
      return path.join('/file', this.path, folder);
    },
    async poll() {
      const now = DateTime.local();
      if (this.refreshInterval < 0) return;
      if (this.refreshInterval && (!this.nextPoll || this.nextPoll < now)) {
        await this.refresh();
        this.nextPoll = now.plus({ seconds: this.refreshInterval });
      }
      setTimeout(this.poll, 1000);
    }
  }
});
</script>

<style scoped lang=scss>
.folder-list, .file-list {
  list-style-type: none;
}
</style>
