<template>
  <v-list-item class="todo-item">
    <v-row no-gutters class="todo-row">
      <v-col cols="8" class="text-column">
        <v-list-item class="todo-text">
          <span :class="{ 'done': todo.isDone }">{{ todo.title }}</span>
        </v-list-item>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-list-item-action class="buttons">
          <v-btn class="done-button" small @click="toggleDone" :color="todo.isDone ? 'grey' : 'success'">
            {{ todo.isDone ? 'Undone' : 'Done' }}
          </v-btn>
          <v-btn class="remove-button" small @click="remove">Remove</v-btn>
        </v-list-item-action>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import type { Todo } from '@/types/todo';

const props = defineProps<{ todo: Todo }>();
const emit = defineEmits<{
  (e: 'toggleDone', id: string): void;
  (e: 'remove', id: string): void;
}>();

const toggleDone = () => emit('toggleDone', props.todo.id);
const remove = () => emit('remove', props.todo.id);
</script>

<style scoped>
.todo-item {
  background: #f9f9f9;
  margin-bottom: 3px;
  border-radius: 4px;
}

.todo-text {
  font-size: 18px;
  text-align: left;
}

.text-column {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-right {
  width: 200px;
  text-align: right;
}

.todo-row {
  display: flex;
  align-items: center;
}

.done {
  text-decoration: line-through;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

.done-button {
  margin-right: 5px;
}
</style>
