import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Валідатор для перевірки, що:
 *  - expirationDate не в минулому
 *  - якщо дата сьогодні, то expirationTime не в минулому
 */
export const dateTimeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!(control instanceof FormGroup)) {
    return null;
  }
  const group = control as FormGroup<{
    expirationDate: AbstractControl;
    expirationTime: AbstractControl;
  }>;
  const dateCtrl = group.controls.expirationDate;
  const timeCtrl = group.controls.expirationTime;
  const now = new Date();
  const today = new Date(now.toDateString());

  // Сброс предыдущих ошибок
  const dErr = { ...dateCtrl.errors };
  delete dErr['invalidDate'];
  dateCtrl.setErrors(Object.keys(dErr).length ? dErr : null);

  const tErr = { ...timeCtrl.errors };
  delete tErr['invalidTime'];
  timeCtrl.setErrors(Object.keys(tErr).length ? tErr : null);

  // Проверка даты
  const dateValue = dateCtrl.value as Date;
  if (dateValue < today) {
    dateCtrl.setErrors({ ...dateCtrl.errors, invalidDate: true });
  }

  // Проверка времени
  const timeValue = timeCtrl.value as string | null;
  if (dateValue.toDateString() === today.toDateString() && timeValue) {
    const [h, m] = timeValue.split(':').map(Number);
    const exp = new Date(dateValue);
    exp.setHours(h, m);
    if (exp < now) {
      timeCtrl.setErrors({ ...timeCtrl.errors, invalidTime: true });
    }
  }

  return null;
};
