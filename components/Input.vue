<template>
  <div class="input-group">
    <v-text-field
        class="input"
        hide-details
        v-model="newTodo"
        @keyup.enter="onAddTodo"
        placeholder="Add a new todo"
    ></v-text-field>
    <v-btn class="add-button" small @click="onAddTodo">Add</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['add-todo']);

const newTodo = ref('');

const onAddTodo = () => {
  if (newTodo.value.trim()) {
    emit('add-todo', newTodo.value);
    newTodo.value = '';
  }
};
</script>

<style scoped>
.input-group {
  position: relative;
  display: flex;
}

.add-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>