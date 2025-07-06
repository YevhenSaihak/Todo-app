import { Routes } from '@angular/router';
import { TodoListComponent } from './features/todo-list/todo-list.component';
import { TodoFormComponent } from './features/todo-form/todo-form.component';

export const routes: Routes = [
  // перенаправлення з корня на /
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'add', component: TodoFormComponent },
  { path: 'list', component: TodoListComponent },
  { path: 'favorite', component: TodoListComponent, data: { favoriteOnly: true } },
  { path: 'edit/:id', component: TodoFormComponent },
  { path: '**', redirectTo: 'list' },
];
