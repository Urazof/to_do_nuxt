<template>
  <v-list-item class="todo-item">
    <v-row no-gutters class="todo-row">
      <v-col cols="8" class="text-column">
        <v-list-item-content class="todo-text">
          <span :class="{ 'done': todo.isDone }">{{ todo.title }}</span>
        </v-list-item-content>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-list-item-action class="buttons">
          <v-btn class="done-button" small @click="$emit('toggleDone', todo.id)" :color="todo.isDone ? 'grey' : 'success'">
            {{ todo.isDone ? 'Undone' : 'Done' }}
          </v-btn>
          <v-btn small @click="$emit('remove', todo.id)">Remove</v-btn>
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
  text-align: center;
}

.text-column {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-right {
  width: 200px;
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

.text-right {
  text-align: right;
}
</style>

