<template>
  <v-form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      :rules="[v => /.+@.+\..+/.test(v) || 'Valid email required']"
      required
      outlined
      class="mb-4"
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="[v => v.length >= 3 || 'Min 3 characters']"
      required
      outlined
      class="mb-4"
    ></v-text-field>

          <div class="button-container">
            <v-btn
              class="equal-btn"
              color="secondary"
              variant="flat"
              @click="navigateTo('/')"
            >
              Back
            </v-btn>
            <v-btn
              class="equal-btn"
              type="submit"
              color="primary"
              variant="flat"
            >
              Sign In
            </v-btn>
          </div>
  </v-form>
</template>

<script setup>
const email = ref('')
const password = ref('')

const emit = defineEmits(['submit']);

const handleSubmit = async () => {
  emit('submit', {
    email: email.value,
    password: password.value
  });
}
</script>
<style scoped>
.button-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.equal-btn {
  flex: 1;
}
</style>
