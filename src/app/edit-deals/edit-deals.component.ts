import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DealService } from '../services/deal.service';
import { DealsInterface } from '../models/deals-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-deals',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-deals.component.html',
  styleUrl: './edit-deals.component.css',
  standalone: true,
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
      name: ['', Validators.required],
      slug: ['', Validators.required],
      title: ['', Validators.required],
      imageFile: [null],
    });
  }

  ngOnInit(): void {
    this.dealService.findDeals(this.dealId).subscribe({
      next: (deal: DealsInterface) => {
        this.dealForm.patchValue({
          name: deal.name,
          slug: deal.slug,
          title: deal.title,
        });
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
      id: this.dealId,
      name: this.dealForm.value.name,
      slug: this.dealForm.value.slug,
      title: this.dealForm.value.title,
      imageFile: this.selectedFile || undefined,
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
