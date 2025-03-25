import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, Observable, throwError } from 'rxjs';
import { DealsInterface, HotelInterface } from '../models/deals.model';
import { ImageInterface } from '../models/image-interface';
import { VideoInterface } from '../models/video-interface';

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
    dealData.append('videoAltText', deal.videoAltText || '');

    if (deal.imageFile) {
      dealData.append('imageFile', deal.imageFile);
    }

    if (deal.videoFile) {
      dealData.append('videoFile', deal.videoFile);
    }
    if (deal.hotels) {
      deal.hotels.forEach((hotel, index) => {
        dealData.append(`Hotels[${index}].Name`, hotel.name);
        dealData.append(`Hotels[${index}].Location`, hotel.location);
        dealData.append(
          `Hotels[${index}].Description`,
          hotel.description || ''
        );
      });
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
    return this.httpClient
      .put(`${this.apiURL}/${id}`, deal, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  updateImage(id: number, image: ImageInterface): Observable<any> {
    const imageData = new FormData();
    if (image.imageFile) {
      imageData.append('imageFile', image.imageFile);
    }

    return this.httpClient
      .put(`${this.apiURL}/update/${id}`, imageData, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  updateVideo(id: number, video: VideoInterface): Observable<any> {
    const videoData = new FormData();

    if (video.videoAltText) {
      videoData.append('videoAltText', video.videoAltText);
    }
    if (video.videoFile) {
      videoData.append('videoFile', video.videoFile);
    }

    return this.httpClient
      .put(`${this.apiURL}/video/${id}`, videoData, this.httpOptions)
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
