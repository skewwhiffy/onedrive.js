<template>
  <div>
    <b-tabs>
      <b-tab title="Users" active>
        <User />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import User from './user.vue';

export default {
  name: 'Main',
  components: {
    User
  }
}
</script>
