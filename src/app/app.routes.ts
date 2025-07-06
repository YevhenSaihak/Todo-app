import { Routes } from '@angular/router';
import { AddTodoComponent } from './features/add-todo/add-todo.component';
import { TodoListComponent } from './features/todo-list/todo-list.component';

export const routes: Routes = [
  // перенаправлення з корня на /add
  { path: '', redirectTo: 'add', pathMatch: 'full' },
  { path: 'add', component: AddTodoComponent },
  { path: 'list', component: TodoListComponent },
  { path: 'favorite', component: TodoListComponent, data: { favoriteOnly: true } },
  { path: '**', redirectTo: 'add' },
];
