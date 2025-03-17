import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, Observable, throwError } from 'rxjs';
import { DealsInterface } from '../models/deals-interface';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private apiURL = 'http://localhost:5011/api/Deals';

  httpOptions = {
    headers: new HttpHeaders({}),
  };

  constructor(private httpClient: HttpClient) {}

  getDeals(): Observable<any> {
    return this.httpClient.get(this.apiURL).pipe(catchError(this.errorHandler));
  }

  createDeals(deal: DealsInterface): Observable<any> {
    const dealData = new FormData();
    dealData.append('name', deal.name);
    dealData.append('slug', deal.slug);
    dealData.append('title', deal.title);

    if (deal.imageFile) {
      dealData.append('imageFile', deal.imageFile);
    }

    return this.httpClient
      .post(this.apiURL, dealData, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  findDeals(id: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiURL}/${id}`)

      .pipe(catchError(this.errorHandler));
  }

  updateDeals(id: number, deal: DealsInterface): Observable<any> {
    const dealData = new FormData();
    dealData.append('name', deal.name);
    dealData.append('slug', deal.slug);
    dealData.append('title', deal.title);

    if (deal.imageFile) {
      dealData.append('imageFile', deal.imageFile);
    }

    return this.httpClient
      .put(`${this.apiURL}/update/${id}`, dealData, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  deleteDeals(id: number) {
    return this.httpClient
      .delete(`${this.apiURL}/${id}`, this.httpOptions)

      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any): Observable<never> {
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
