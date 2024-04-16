import { Todo } from '../../../types/todo';
import { todos } from '../../../mocks/todos';

export default defineEventHandler(async () => {
    return todos;
});
