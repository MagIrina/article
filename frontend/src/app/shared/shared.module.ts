import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CallbackModalComponent} from "./components/callback-modal/callback-modal.component";
import {ServiceModalComponent} from "./components/service-modal/service-modal.component";
import {RouterModule} from "@angular/router";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    CallbackModalComponent,
    ServiceModalComponent,
    ArticleCardComponent,
    TruncatePipe,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  exports: [
    ArticleCardComponent,
    CallbackModalComponent,
    ServiceModalComponent,
    TruncatePipe,
    LoaderComponent
  ]
})
export class SharedModule { }
