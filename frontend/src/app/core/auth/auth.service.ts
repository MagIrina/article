import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, throwError, catchError, tap, BehaviorSubject, of} from 'rxjs';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment';
import {LoginResponseType} from '../../../types/login-response.type';
import {DefaultResponseType} from '../../../types/default-response.type';
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey = 'accessToken';
  public refreshTokenKey = 'refreshToken';
  public userIdKey = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged = false;

  private userInfo = new BehaviorSubject<UserInfoType | null>(null);
  userInfo$ = this.userInfo.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }


  login(email: string, password: string, rememberMe: boolean): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    }).pipe(
      tap(res => {
        this.setTokens(res.accessToken, res.refreshToken);
        if (res.userId) this.userId = res.userId;
        this.getUserInfo();
      })
    );
  }


  signup(name: string, email: string, password: string): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>(environment.api + 'signup', {
      name, email, password
    }).pipe(
      tap(res => {
        this.setTokens(res.accessToken, res.refreshToken);
        if (res.userId) this.userId = res.userId;
        this.getUserInfo();
      })
    );
  }

  getUserInfo(): void {
    const token = this.getAccessToken();
    if (!token) {
      this.userInfo.next(null);
      return;
    }

    this.http.get<UserInfoType>(environment.api + 'users', {
      headers: { 'x-auth': token }
    }).subscribe({
      next: (user) => {
        this.userInfo.next(user);
        localStorage.setItem('userName', user.name);
      },
      error: () => {
        this.userInfo.next(null);
        localStorage.removeItem('userName');
      }
    });
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();

    if (tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      }).pipe(
        tap(() => {
          this.removeTokens();
          this.userInfo.next(null);
        }),
        catchError((err) => {
          this.removeTokens();
          this.userInfo.next(null);
          this._snackBar.open('Вы вышли.', 'Закрыть', { duration: 2000 });
          return of({ error: false, message: 'Разлогинен локально' } as DefaultResponseType);
        })
      );
    }

    this.removeTokens();
    this.userInfo.next(null);
    return of({ error: false, message: 'Разлогинен локально (refreshToken отсутствует)' } as DefaultResponseType);
  }

  refresh(): Observable<LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens.refreshToken) {
      return this.http.post<LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      }).pipe(
        tap(res => {
          this.setTokens(res.accessToken, res.refreshToken);
        }),
        catchError(err => {
          this.handleAuthFailure();
          return throwError(() => err);
        })
      );
    }
    this.handleAuthFailure();
    return throwError(() => 'Refresh token missing');
  }

  handleAuthFailure(): void {
    this.removeTokens();
    this._snackBar.open('Ваша сессия истекла, войдите снова', 'Закрыть', { duration: 3000 });
    this.router.navigate(['/login']);
  }


  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  removeTokens(): void {
    localStorage.clear();
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  getAccessToken(): string {
    return localStorage.getItem(this.accessTokenKey) || '';
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }
}
