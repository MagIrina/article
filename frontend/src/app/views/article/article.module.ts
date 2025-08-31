import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import { ArticlePageComponent } from './article-page/article-page.component';


@NgModule({
  declarations: [
    BlogComponent,
    ArticlePageComponent,
  ],
  imports: [
    MatFormFieldModule,
    SharedModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
  ]
})
export class ArticleModule { }
