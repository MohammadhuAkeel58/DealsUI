import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DealService } from '../services/deal.service';
import { DealsInterface } from '../models/deals-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-deal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-deal.component.html',
  styleUrl: './create-deal.component.css',
})
export class CreateDealComponent {
  dealForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private formb: FormBuilder, private dealService: DealService) {
    this.dealForm = this.formb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      title: ['', Validators.required],
      imageFile: [null],
    });
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
    };

    this.dealService.createDeals(dealData).subscribe({
      next: (response) => console.log('Deal Created:', response),
      error: (err) => console.error('Error:', err),
    });
  }
}
