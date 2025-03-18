import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DealsInterface } from '../models/deals-interface';
import { DealService } from '../services/deal.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-deals-list',
  imports: [CommonModule],
  templateUrl: './deals-list.component.html',
  styleUrl: './deals-list.component.css',
})
export class DealsListComponent implements OnInit {
  deals: DealsInterface[] = [];

  constructor(public dealService: DealService, private router: Router) {}

  ngOnInit(): void {
    this.dealService.getDeals().subscribe((data: DealsInterface[]) => {
      this.deals = data;
    });
  }
  updateDeals(id: number) {
    this.router.navigate(['/edit-deals', id]);
  }
  AddDeals() {
    this.router.navigate(['/create-deal']);
  }

  deleteDeals(id: number) {
    if (confirm('Are you sure want to Dellete This File?')) {
      this.dealService.deleteDeals(id).subscribe((res) => {
        this.deals = this.deals.filter((item) => item.id !== id);
      });
    }
    alert('Delete Successfull');
  }
}
