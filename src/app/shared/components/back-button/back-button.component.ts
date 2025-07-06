import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../material/material';

@Component({
  standalone: true,
  selector: 'app-back-button',
  imports: [MATERIAL_IMPORTS],
  templateUrl: './back-button.component.html',
})
export class BackButtonComponent {
  constructor(public location: Location) {}
}
