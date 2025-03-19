import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { DealService } from '../services/deal.service';
import { DealsInterface } from '../models/deals.model';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-deal',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
  ],
  templateUrl: './create-deal.component.html',
  styleUrl: './create-deal.component.css',
})
export class CreateDealComponent {
  dealForm: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private formb: FormBuilder,
    private dealService: DealService,
    private router: Router
  ) {
    this.dealForm = this.formb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      title: ['', Validators.required],
      imageFile: [null],
      hotels: this.formb.array([this.createHotelGroup()]),
    });
  }
  isLinear = false;

  get hotels() {
    return this.dealForm.get('hotels') as FormArray;
  }
  addHotels() {
    this.hotels.push(this.createHotelGroup());
  }

  createHotelGroup() {
    return this.formb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  removeHotel(index: number) {
    this.hotels.removeAt(index);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.selectedFile = null;
        this.imagePreview = null;
        this.dealForm.get('imageFile')?.setErrors({ invalidType: true });
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.dealForm.invalid) return;

    const dealData: DealsInterface = {
      id: 0,
      name: this.dealForm.value.name,
      slug: this.dealForm.value.slug,
      title: this.dealForm.value.title,
      imageFile: this.selectedFile || undefined,
      hotels: this.dealForm.value.hotels,
    };

    this.dealService.createDeals(dealData).subscribe({
      next: (response) => {
        console.log('Deal Created:', response),
          this.router.navigate(['deals-list']);
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
