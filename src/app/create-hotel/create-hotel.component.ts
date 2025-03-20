import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DealService } from '../services/deal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelInterface } from '../models/deals.model';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-hotel',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    FormsModule,
  ],
  templateUrl: './create-hotel.component.html',
  styleUrl: './create-hotel.component.css',
})
export class CreateHotelComponent {
  hotelForm: FormGroup;

  constructor(
    private formb: FormBuilder,
    private dealService: DealService,
    private router: Router
  ) {
    this.hotelForm = this.formb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      dealId: ['', Validators.required],
    });
  }
  isLinear = false;

  onSubmit() {
    if (this.hotelForm.invalid) return;

    const hotelData: HotelInterface = {
      name: this.hotelForm.value.name,
      location: this.hotelForm.value.location,
      description: this.hotelForm.value.description,
      dealId: this.hotelForm.value.dealId,
    };
    console.log(hotelData);

    this.dealService.createHotels(hotelData).subscribe({
      next: (response) => {
        console.log('Hotel Created:', response),
          this.router.navigate(['deals-list']);
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
