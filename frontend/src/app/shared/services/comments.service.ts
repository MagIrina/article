import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentsResponseType } from '../../../types/comments-response.type';
import { CommentActionResponseType } from '../../../types/comment-action-response.type';
import { CommentActionType } from '../../../types/comment-action.type';
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";

@Injectable({
  providedIn: 'root'
})

export class CommentsService {
  private baseUrl = environment.api + 'comments';

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getComments(articleId: string, offset: number = 0): Observable<CommentsResponseType> {
    const params = new HttpParams()
      .set('offset', String(offset))
      .set('article', articleId);
    return this.http.get<CommentsResponseType>(this.baseUrl, { params });
  }

  addComment(articleId: string, text: string): Observable<CommentActionResponseType> {
    return this.http.post<CommentActionResponseType>(
      this.baseUrl,
      { text, article: articleId },
      { headers: this.authHeaders() }
    );
  }

  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<CommentActionResponseType> {
    return this.http.post<CommentActionResponseType>(
      `${this.baseUrl}/${commentId}/apply-action`,
      { action },
      { headers: this.authHeaders() }
    );
  }

  getArticleCommentActions(articleId: string): Observable<CommentActionType[]> {
    const params = new HttpParams().set('articleId', articleId);
    return this.http.get<CommentActionType[]>(
      `${this.baseUrl}/article-comment-actions`,
      { headers: this.authHeaders(), params }
    );
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return token ? new HttpHeaders().set('x-auth', token) : new HttpHeaders();
  }
}
