import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {ArticleDetailType, ArticleType} from "../../../types/article.type";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {}
  private apiUrl = environment.api + 'articles';


  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>( `${this.apiUrl}/top`);
  }

  getArticles(page: number, categories: string[]) {
    const params: any = { page: page.toString() };

    if (categories && categories.length) {
      params['categories[]'] = categories;
    }

    return this.http.get<{
      count: number;
      pages: number;
      items: ArticleType[];
    }>(this.apiUrl, { params });
  }

  getArticle(url: string): Observable<ArticleDetailType> {
    return this.http.get<ArticleDetailType>(`${this.apiUrl}/${url}`);
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(`${this.apiUrl}/related/${url}`);
  }

}
