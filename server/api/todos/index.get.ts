import { todos } from '../../../mocks/todos';
import Todo from '~/server/models/Todo';

export default defineEventHandler(async () => {

    return todos;
});
