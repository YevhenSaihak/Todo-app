import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { TodoService } from '../../core/services/todo.service';
import { dateTimeValidator } from '../../shared/validators/date-time.validator'; // <-- імпорт вашого валідатора
import { BackButtonComponent } from '../../shared/components/back-button/back-button.component';
import { MATERIAL_IMPORTS } from '../../shared/material/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { APP_DATE_FORMATS } from '../../shared/material/date-formats';
import { TodoModel } from '../../core/models/todo.model';

@Component({
  standalone: true,
  selector: 'app-add-todo',
  imports: [
    ReactiveFormsModule,
    BackButtonComponent,
    ...MATERIAL_IMPORTS,
    NgxMaterialTimepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk' },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
})
export class AddTodoComponent implements OnInit {
  // Типізована форма з контролами
  form!: FormGroup<{
    title: FormControl<string>;
    expirationDate: FormControl<Date>;
    expirationTime: FormControl<string | null>;
  }>;

  // Прапор сабміту, щоб показувати помилки
  submitted = false;

  constructor(
    private todoService: TodoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Ініціалізуємо форму
    this.form = new FormGroup(
      {
        // Заголовок: обов'язковий, до 100 символів
        title: new FormControl('', {
          nonNullable: true,
          validators: [ctrl => Validators.required(ctrl), ctrl => Validators.maxLength(100)(ctrl)],
        }),
        // Дата: обов'язкова
        expirationDate: new FormControl(new Date(), {
          nonNullable: true,
          validators: [ctrl => Validators.required(ctrl)],
        }),
        // Час: необов'язковий
        expirationTime: new FormControl<string | null>(null),
      },
      {
        // Груповий валідатор — імпортований з окремого файлу
        validators: [dateTimeValidator],
      },
    );
  }

  /** Обробник сабміту форми */
  onSubmit = (): void => {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const title = this.form.controls.title.value;
    const expirationDate = this.form.controls.expirationDate.value;
    const expirationTime = this.form.controls.expirationTime.value;

    const newTodo: TodoModel = {
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
      expirationDate: expirationDate.toISOString(),
      expirationTime: expirationTime ?? undefined,
      favorite: false,
    };

    // Явно ігноруємо підписку, щоб ESLint не скаржився
    void this.todoService.create(newTodo).subscribe(() => {
      void this.router.navigate(['/list']);
    });
  };
}
