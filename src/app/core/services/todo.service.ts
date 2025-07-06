import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, delay, tap } from 'rxjs/operators';
import { TodoModel } from '../models/todo.model';
import { TODO_ARRAY_SCHEMA } from '../schemas/todo-schema';

// Функція для генерації випадкової затримки 300–400 мс
const randomDelay = () => 300 + Math.floor(Math.random() * 100);

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private todos: TodoModel[] = []; // Кеш у пам’яті

  constructor(private storage: StorageMap) {}

  // Отримати всі TODO.
  // Якщо кеш уже є — повертаємо його без затримки.
  // Інакше — читаємо з LS із затримкою.
  getAll(): Observable<TodoModel[]> {
    if (this.todos.length > 0) {
      return of(this.todos);
    }

    return this.storage.get<TodoModel[]>(this.STORAGE_KEY, TODO_ARRAY_SCHEMA).pipe(
      delay(randomDelay()), // імітація затримки
      tap(list => {
        this.todos = list ?? []; // оновлюємо кеш
      }),
      map(list => list ?? []),
    );
  }

  // Створити новий TODO.
  // Додаємо в кеш і зберігаємо в LS із затримкою.
  create(todo: TodoModel): Observable<TodoModel> {
    this.todos = [...this.todos, todo];

    return this.storage.set(this.STORAGE_KEY, this.todos).pipe(
      delay(randomDelay()),
      map(() => todo),
    );
  }

  // Оновити існуючий TODO.
  // Модифікуємо кеш і оновлюємо LS.
  update(updated: TodoModel): Observable<TodoModel> {
    this.todos = this.todos.map(t => (t.id === updated.id ? updated : t));

    return of(updated).pipe(
      delay(randomDelay()),
      tap(() => {
        this.storage.set(this.STORAGE_KEY, this.todos).subscribe();
      }),
    );
  }

  // Видалити TODO за ідентифікатором.
  // Очищуємо кеш і LS.
  delete(id: string): Observable<void> {
    this.todos = this.todos.filter(t => t.id !== id);

    return of(undefined).pipe(
      delay(randomDelay()),
      tap(() => {
        this.storage.set(this.STORAGE_KEY, this.todos).subscribe();
      }),
    );
  }

  // Переключити стан “в обране”.
  // Знаходимо задачу, міняємо favorite і оновлюємо.
  toggleFavorite(id: string): Observable<TodoModel> {
    const found = this.todos.find(t => t.id === id);
    if (!found) {
      return throwError(() => new Error(`Todo з id=${id} не знайдено`));
    }

    const updated = { ...found, favorite: !found.favorite };
    return this.update(updated);
  }

  // Отримати TODO по id
  // Повертає задачу або undefined
  getById(id: string): Observable<TodoModel | undefined> {
    return this.getAll().pipe(map(list => list.find(t => t.id === id)));
  }
}
