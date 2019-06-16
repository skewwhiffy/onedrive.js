<template>
  <div>
    <h1>Users</h1>
    <div v-if="!loading">
      <h2 v-if="users.length === 0">No users</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.email }}
        </li>
      </ul>
      <b-button @click="addUser">Add</b-button>
    </div>
    <div v-if="loading">
      <h2>Loading</h2>
    </div>
  </div>
</template>

<script>
import Api from '../api/api';

const api = new Api();
export default {
  name: 'Main',
  data() {
    return {
      loading: false,
      users: []
    };
  },
  created() {
    this.refreshUserList();
  },
  methods: {
    async refreshUserList() {
      this.loading = true;
      this.users = await api.getUsers();
      this.loading = false;
    },
    addUser() {
      console.log('Need to add user');
    }
  }
};
</script>
