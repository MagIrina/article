import {Component, Input} from '@angular/core';
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}

  @Input() type: 'global' | 'button' = 'global';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
