import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  isModalOpen = false;
  currentUrl: string = '';
  currentFragment: string | null = null;
  @Output() openCallback = new EventEmitter<void>();

  constructor(private router: Router) {

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

  openModal() {
    this.openCallback.emit();
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
