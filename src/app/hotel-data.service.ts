import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from './hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelDataService {

  private apiUrl = 'http://localhost:3000/hotelData';  // API endpoint


  constructor(private http: HttpClient) { }

  getHotelData(): Observable<Hotel> {
   
        return this.http.get<Hotel>(this.apiUrl);
        
  }



}
