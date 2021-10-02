import { environment } from '../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MapComponent} from './map/map.component'

@Injectable({
  providedIn: 'root'
})
export class DataService {
    baseURL : string = 'http://127.0.0.1:8080/'

  constructor(private http: HttpClient) {
  
   }

   // distribution function to call the post api with parameters in backend

  getDistribution(arr: any []): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    let arrayToString = JSON.stringify(Object.assign({},arr))
    return this.http.post(this.baseURL+'distribution',arrayToString,{'headers':headers})
    
  }
}
