import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ServiceRequestType} from "../../../types/service-request.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) { }

  sendRequest(payload: ServiceRequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>( environment.api + 'requests', payload);
  }
}
