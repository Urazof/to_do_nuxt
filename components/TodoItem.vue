<template>
  <v-row no-gutters class="todo-row">
    <v-col cols="7">
      <v-list-item-content>
        <span :class="{ 'done': todo.isDone }">{{ todo.text }}</span>
      </v-list-item-content>
    </v-col>
    <v-col cols="5" class="text-right">
      <v-list-item-action class="buttons">
        <v-btn class="done-button" small @click="$emit('toggleDone', todo)" :color="todo.isDone ? 'grey' : 'success'">
          {{ todo.isDone ? 'Undone' : 'Done' }}
        </v-btn>
        <v-btn small @click="$emit('remove', todo)" >Remove</v-btn>
      </v-list-item-action>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "TodoItem",
  props: ['todo'],
  emits: ['toggleDone', 'remove']
}
</script>

<style scoped>
.text-right {
  text-align: right;
}
.todo-row{
  padding: 5px 0;
}

.buttons{
  display: flex;
  justify-content: end;
}

.done-button{
  margin-right: 5px;
}
</style>

