import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  userName: string | null = null;
  currentUrl: string = '';
  currentFragment: string | null = null;

  constructor(private authService: AuthService,
              private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        const tree = this.router.parseUrl(this.currentUrl);
        this.currentFragment = tree.fragment;
      }
    });
  }

  isActiveFragment(fragment: string): boolean {
    return this.currentFragment === fragment;
  }

  isActiveRoute(route: string) {
    return this.currentUrl.startsWith(route);
  }

  ngOnInit(): void {
    this.isLogged = this.authService.isLoggedIn();
    if (this.isLogged) {
      this.authService.getUserInfo();
    }

    this.authService.isLogged$.subscribe(status => {
      this.isLogged = status;
      if (status) {
        this.authService.getUserInfo();
      } else {
        this.userName = null;
      }
    });

    this.authService.userInfo$.subscribe(user => {
      this.userName = user?.name || null;
    });
  }

  logout(): void {
    this.authService.logout()
      .subscribe(() => {
      this.isLogged = false;
      this.userName = null;
    });
  }
}
