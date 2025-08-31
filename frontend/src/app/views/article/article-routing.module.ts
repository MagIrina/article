import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BlogComponent} from "./blog/blog.component";
import {ArticlePageComponent} from "./article-page/article-page.component";

const routes: Routes = [
      { path: 'blog', component: BlogComponent },
      { path: 'article/:url', component: ArticlePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
