import { test, expect } from '@playwright/test';

test('Todo app functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await expect(page.locator('.todo-list')).toBeVisible();

    const newTodoInput = page.locator('.v-text-field input');

    await expect(newTodoInput).toBeVisible();
    await expect(newTodoInput).toBeEnabled();

    await page.waitForSelector('.todo-item');

    const todoItemsCount = await page.locator('.todo-item').count();
    console.log('Number of todo items:', todoItemsCount);


    await newTodoInput.fill('New Todo Item', { force: true });
    await newTodoInput.press('Enter');

    const newTodoItem = page.locator('.todo-item').last();
    await expect(newTodoItem).toContainText('New Todo Item');

    const doneButton = page.locator('.done-button').last();
    await doneButton.click();
    await expect(doneButton).toHaveText('Undone');

    const removeButton = page.locator('text=Remove').last();
    await removeButton.click();

    await expect(page.locator('.todo-item')).toHaveCount(todoItemsCount);
});
