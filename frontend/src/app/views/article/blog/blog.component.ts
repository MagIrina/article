import { Component, OnInit } from '@angular/core';
import { CategoryType } from "../../../../types/category.type";
import { ArticleType } from "../../../../types/article.type";
import { ActivatedRoute, Router } from "@angular/router";
import { ArticlesService } from "../../../shared/services/articles.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  selectedCategories: string[] = [];
  page = 1;
  totalPages = 1;
  sortingOpen = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;

      this.selectedCategories = params['categories']
        ? (Array.isArray(params['categories']) ? [...params['categories']] : [params['categories']])
        : [];

      this.loadArticles();
    });

    this.categories = [
      { id: '1', name: 'Фриланс', url: 'frilans' },
      { id: '2', name: 'Дизайн', url: 'dizain' },
      { id: '3', name: 'SMM', url: 'smm' },
      { id: '4', name: 'Таргет', url: 'target' },
      { id: '5', name: 'Копирайтинг', url: 'kopiraiting' },
    ];
  }

  private closeTimeout: any;

  startCloseTimer() {
    this.clearCloseTimer();
    this.closeTimeout = setTimeout(() => {
      this.sortingOpen = false;
    }, 3000);
  }

  clearCloseTimer() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  onArticleOpen(article: ArticleType): void {
    this.router.navigate(['/article', article.url]);
  }

  loadArticles(): void {
    this.articleService.getArticles(this.page, this.selectedCategories).subscribe({
      next: res => {
        this.articles = res.items;
        this.totalPages = res.pages;
      },
      error: err => {
        console.error('Ошибка загрузки статей', err);
      }
    });
  }

  toggleCategory(cat: CategoryType): void {
    if (this.selectedCategories.includes(cat.url)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== cat.url);
    } else {
      this.selectedCategories = [...this.selectedCategories, cat.url];
    }

    this.page = 1;
    this.updateQueryParams();
  }

  removeCategory(catUrl: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== catUrl);
    this.page = 1;
    this.updateQueryParams();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.updateQueryParams();
    }
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        categories: this.selectedCategories.length > 0 ? this.selectedCategories : []
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }
}
