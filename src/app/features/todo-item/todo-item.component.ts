import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../shared/material/material';
import { TodoModel } from '../../core/models/todo.model';
import { interval, map, startWith, Subscription } from 'rxjs';
import { TodoTimerService } from '../../core/services/todo-timer.service';

@Component({
  standalone: true,
  selector: 'app-todo-item',
  imports: [CommonModule, NgIf, NgClass, ...MATERIAL_IMPORTS],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements OnInit, OnDestroy {
  @Input() todo!: TodoModel;
  @Output() removed = new EventEmitter<string>();
  @Output() toggledFavorite = new EventEmitter<string>();

  timeLeftValue = '';
  private sub?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private timerService: TodoTimerService,
  ) {}

  ngOnInit(): void {
    this.sub = this.timerService.getTimeLeftStream(this.todo).subscribe(val => {
      this.timeLeftValue = val;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onRemove(): void {
    this.removed.emit(this.todo.id);
  }

  onToggleFavorite(): void {
    this.toggledFavorite.emit(this.todo.id);
  }
}
