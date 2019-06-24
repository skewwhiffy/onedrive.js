<template>
  <div>
    <b-tabs>
      <b-tab title="Users" active>
        <User />
      </b-tab>
      <b-tab title="Files">
        <File />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import User from './user.vue';
import File from './file.vue';

export default {
  name: 'Main',
  components: { User, File }
};
</script>
