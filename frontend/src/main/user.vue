<template>
  <div>
    <h1>Users</h1>
    <div v-if="!loading">
      <div class="row">
        <div class="col-sm-2">
          <h2 v-if="users.length === 0">
            No users
          </h2>
          <ul>
            <li v-for="user in users" :key="user.id">
              {{ user.displayName }}
            </li>
          </ul>
          <b-button v-if="users.length !== 1" @click="addUser">
            Add
          </b-button>
        </div>
        <div class="col-sm-10">
          <p>Status {{ status }}</p>
        </div>
      </div>
    </div>
    <div v-if="loading">
      <h2>Loading</h2>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Api from '../api/api';

const api = new Api();
export default Vue.extend({
  name: 'Main',
  data() {
    return {
      loading: false,
      users: [],
      status: 'unknown',
      loginUrl: false
    };
  },
  created() {
    this.refreshUserList();
  },
  methods: {
    async refreshUserList() {
      this.loading = true;
      this.users = await api.getUsers();
      if (this.users.length === 1) {
        this.$emit('setUserId', this.users[0].id);
        const status = await api.getStatus(this.users[0].id);
        this.status = status.status;
        this.$emit('setUserStatus', this.status);
      }
      this.loginUrl = await api.getLoginUrl();
      this.loading = false;
    },
    addUser() {
      window.location.href = this.loginUrl;
    }
  }
});
</script>
