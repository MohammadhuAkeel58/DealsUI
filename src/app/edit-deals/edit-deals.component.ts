import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { DealService } from '../services/deal.service';
import { DealsInterface } from '../models/deals.model';
import { CommonModule } from '@angular/common';
import { ImageInterface } from '../models/image-interface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-deals',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    FormsModule,
  ],
  templateUrl: './edit-deals.component.html',
  styleUrl: './edit-deals.component.css',
})
export class EditDealsComponent implements OnInit {
  dealForm: FormGroup;
  dealId: number;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private formb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService
  ) {
    this.dealId = +this.route.snapshot.paramMap.get('id')!;
    this.dealForm = this.formb.group({
      dealInfo: this.formb.group({
        name: ['', Validators.required],
        slug: ['', Validators.required],
        title: ['', Validators.required],
        imageFile: [null],
      }),
      hotels: this.formb.array([this.createHotelGroup()]),
    });
  }

  isLinear = false;
  get hotels() {
    return this.dealForm.get('hotels') as FormArray;
  }

  createHotelGroup(hotel?: any) {
    return this.formb.group({
      name: [hotel?.name || '', Validators.required],
      location: [hotel?.location || '', Validators.required],
      description: [hotel?.description || '', Validators.required],
    });
  }

  addHotel(hotel?: any) {
    this.hotels.push(this.createHotelGroup(hotel));
  }

  removeHotel(index: number) {
    this.hotels.removeAt(index);
  }

  ngOnInit(): void {
    this.dealService.findDeals(this.dealId).subscribe({
      next: (deal: DealsInterface) => {
        this.dealForm.get('dealInfo')?.patchValue({
          name: deal.name,
          slug: deal.slug,
          title: deal.title,
        });

        if (deal.hotels) {
          deal.hotels.forEach((hotel) => this.addHotel(hotel));
        }

        this.imagePreview = deal.image
          ? `http://localhost:5011${deal.image}`
          : null;
      },
      error: (err) => console.error('Error fetching deal:', err),
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
      console.log('select', this.selectedFile);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    const imageData: ImageInterface = {
      id: this.dealId,
      imageFile: this.selectedFile || undefined,
    };
    this.dealService.updateImage(this.dealId, imageData).subscribe({
      next: (response) => {
        console.log('Image Updated:', response);
      },
      error: (err) => console.error('Error updating deal:', err),
    });
  }

  onSubmit() {
    if (this.dealForm.invalid) return;
    const dealInfo = this.dealForm.value.dealInfo;
    const dealData: DealsInterface = {
      id: this.dealId,
      name: dealInfo.name,
      slug: dealInfo.slug,
      title: dealInfo.title,
      hotels: dealInfo.hotels,
    };

    this.dealService.updateDeals(this.dealId, dealData).subscribe({
      next: (response) => {
        console.log('Deal Updated:', response);
        this.router.navigate(['deals-list']);
      },
      error: (err) => console.error('Error updating deal:', err),
    });
  }
}
