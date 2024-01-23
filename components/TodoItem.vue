<template>
  <v-list-item class="todo-item">
    <v-row no-gutters class="todo-row">
      <v-col cols="7">
        <v-list-item-content class="todo-text">
          <span :class="{ 'done': todo.isDone }">{{ todo.text }}</span>
        </v-list-item-content>
      </v-col>
      <v-col cols="5" class="text-right">
        <v-list-item-action class="buttons">
          <v-btn class="done-button" small @click="$emit('toggleDone', todo)" :color="todo.isDone ? 'grey' : 'success'">
            {{ todo.isDone ? 'Undone' : 'Done' }}
          </v-btn>
          <v-btn small @click="$emit('remove', todo)">Remove</v-btn>
        </v-list-item-action>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script>
export default {
  name: "TodoItem",
  props: ['todo'],
  emits: ['toggleDone', 'remove']
}
</script>

<style scoped>
.todo-item {
  background: #f9f9f9;
  margin-bottom: 3px;
  border-radius: 4px;
}

.todo-text {
  font-size: 18px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  justify-content: end;
}

.done-button {
  margin-right: 5px;
}

.text-right {
  text-align: right;
}
</style>

