import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleType;
  @Output() open = new EventEmitter<ArticleType>();
  articles: ArticleType[] = [];
}
