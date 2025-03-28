import { Routes } from '@angular/router';
import { CreateDealComponent } from './create-deal/create-deal.component';
import { DealsListComponent } from './deals-list/deals-list.component';
import { EditDealsComponent } from './edit-deals/edit-deals.component';

export const routes: Routes = [
  { path: 'create-deal', component: CreateDealComponent },
  { path: 'deals-list', component: DealsListComponent },
  { path: 'edit-deals/:id', component: EditDealsComponent },
];
