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
    FormsModule,
  ],
  templateUrl: './create-deal.component.html',
  styleUrl: './create-deal.component.css',
})
export class CreateDealComponent {
  dealForm: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  videoFile: File | null = null;
  videoPreview: string | null = null;

  constructor(
    private formb: FormBuilder,
    private dealService: DealService,
    private router: Router
  ) {
    this.dealForm = this.formb.group({
      dealInfo: this.formb.group({
        name: ['', Validators.required],
        slug: ['', Validators.required],
        title: ['', Validators.required],
        imageFile: [null],
        videoInfo: this.formb.group({
          videoFile: [null],
          videoAltText: ['', Validators.required],
        }),
      }),
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
        this.dealForm
          .get('dealInfo.imageFile')
          ?.setErrors({ invalidType: true });
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

  onVideoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        this.videoFile = null;
        this.videoPreview = null;
        this.dealForm
          .get('dealInfo.videoInfo.videoFile')
          ?.setErrors({ invalidType: true });
        return;
      }
      this.videoFile = file;
      this.videoPreview = URL.createObjectURL(file);
      this.dealForm.get('dealInfo.videoInfo.videoFile')?.setValue(file);
    }
  }

  onSubmit() {
    if (this.dealForm.invalid) return;
    const dealInfo = this.dealForm.value.dealInfo;
    const dealData: DealsInterface = {
      id: 0,
      name: dealInfo.name,
      slug: dealInfo.slug,
      title: dealInfo.title,
      videoAltText: dealInfo.videoInfo.videoAltText,
      imageFile: this.selectedFile || undefined,
      videoFile: this.videoFile || undefined,
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
