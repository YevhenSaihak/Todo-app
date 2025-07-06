import { Routes } from '@angular/router';
import { AddTodoComponent } from './features/add-todo/add-todo.component';

export const routes: Routes = [
  // перенаправлення з корня на /add
  { path: '', redirectTo: 'add', pathMatch: 'full' },
  { path: 'add', component: AddTodoComponent },
  { path: '**', redirectTo: 'add' },
];
