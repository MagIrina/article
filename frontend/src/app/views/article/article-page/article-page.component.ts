import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleDetailType, ArticleType} from "../../../../types/article.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentActionType} from "../../../../types/comment-action.type";
import {CommentsService} from "../../../shared/services/comments.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {
  article?: ArticleDetailType;
  relatedArticles: ArticleType[] = [];


  comments: CommentType[] = [];
  userActions: CommentActionType[] = [];
  visibleCommentsCount = 3;
  totalCount = 0;
  offset = 0;
  loading = false;
  isLoggedIn = false;
  loadingMore = false;
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLTextAreaElement>;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService,
    private router: Router,
    private commentsService: CommentsService,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.isLogged$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.route.paramMap.subscribe(params => {
      const url = params.get('url');
      if (url) {
        this.loadArticle(url);
        this.loadRelatedArticles(url);
      }
    });
  }

  private loadArticle(url: string) {
    this.articlesService.getArticle(url).subscribe(article => {
      this.article = article;
      if (this.article?.id) {
        this.offset = 0;
        this.loadComments();

        if (this.isLoggedIn) {
          this.loadUserActions();
        }
      }
    });
  }

  private loadRelatedArticles(url: string) {
    this.articlesService.getRelatedArticles(url)
      .subscribe(articles => this.relatedArticles = articles);
  }

  onArticleOpen(article: ArticleType): void {
    this.router.navigate(['/article', article.url]);
  }

  loadComments(): void {
    if (!this.article?.id) return;

    this.loading = true;
    this.commentsService.getComments(this.article.id, this.offset)
      .subscribe({
        next: (res) => {
          this.comments = res.comments;
          this.totalCount = res.allCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Ошибка загрузки комментариев', err);
          this.loading = false;
        }
      });
  }

  showMore(): void {
    this.loadingMore = true;

    setTimeout(() => {
      this.visibleCommentsCount += 3;
      this.loadingMore = false;
    }, 1500);
  }

  addComment(text: string): void {
    if (!this.article?.id) return;

    this.commentsService.addComment(this.article.id, text).subscribe({
      next: () => {
        this._snackBar.open('Комментарий добавлен!', '', {duration: 2000});
        this.offset = 0;
        this.loadComments();
        if (this.commentInput) {
          this.commentInput.nativeElement.value = '';
        }
      },
      error: () => {
        this._snackBar.open('Ошибка при добавлении комментария', '', {duration: 2000});
      }
    });
  }

  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): void {
    this.commentsService.applyAction(commentId, action).subscribe({
      next: (res) => {
        this._snackBar.open(
          action === 'violate' ? res.message : 'Ваш голос учтен',
          '',
          {duration: 2000}
        );
        this.loadComments();
        this.loadUserActions();
      },
      error: (err) => {
        this._snackBar.open( 'Для даного действия - необходимо авторизоваться', '', {duration: 2000});
      }
    });
  }

  loadUserActions(): void {
    if (!this.article?.id) return;

    this.commentsService.getArticleCommentActions(this.article.id).subscribe({
      next: (res) => (this.userActions = res),
      error: (err) => console.warn('Ошибка получения действий', err)
    });
  }

  isActionActive(commentId: string, action: 'like' | 'dislike'): boolean {
    return this.userActions.some(a => a.comment === commentId && a.action === action);
  }

  share(platform: 'facebook' | 'instagram' | 'vk'): void {
    const pageUrl = encodeURIComponent(window.location.href);
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/direct/new/?text=${pageUrl}`;
        break;
      case 'vk':
        shareUrl = `https://vk.com/share.php?url=${pageUrl}`;
        break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}
