import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../core/services/todo.service';
import { TodoModel } from '../../core/models/todo.model';
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { MATERIAL_IMPORTS } from '../../shared/material/material';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-todo-list',
  imports: [BackButtonComponent, TodoItemComponent, ...MATERIAL_IMPORTS, MatProgressSpinnerModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  favoriteOnly = false;
  todosList: TodoModel[] = [];
  loading = true;

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.favoriteOnly = this.route.snapshot.data['favoriteOnly'] === true;
    this.loadTodos();
  }

  loadTodos(): void {
    this.loading = true;

    this.todoService.getAll().subscribe(list => {
      const filtered = this.favoriteOnly ? list.filter(t => t.favorite) : list;
      this.todosList = filtered;
      this.loading = false;
    });
  }

  isToday(dateStr: string): boolean {
    const target = new Date(dateStr);
    const today = new Date();
    return target.toDateString() === today.toDateString();
  }

  get todayTodos(): TodoModel[] {
    return this.todosList.filter(todo => this.isToday(todo.expirationDate));
  }

  get otherTodos(): TodoModel[] {
    return this.todosList.filter(todo => !this.isToday(todo.expirationDate));
  }

  onRemoved(id: string): void {
    this.todosList = this.todosList.filter(t => t.id !== id);
    this.todoService.delete(id).subscribe();
  }

  onToggleFavorite(id: string): void {
    this.todoService.toggleFavorite(id).subscribe(updated => {
      const idx = this.todosList.findIndex(t => t.id === id);
      if (idx !== -1) {
        this.todosList[idx] = updated;
      }
    });
  }

  onEdit(id: string): void {
    void this.router.navigate(['/edit', id]);
  }
}
