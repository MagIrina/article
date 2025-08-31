import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CategoryType} from "../../../../types/category.type";
import {ServiceRequestType} from "../../../../types/service-request.type";
import {CategoriesService} from "../../services/categories.service";
import {RequestsService} from "../../services/requests.service";

@Component({
  selector: 'app-service-modal',
  templateUrl: './service-modal.component.html',
  styleUrls: ['./service-modal.component.scss']
})
export class ServiceModalComponent implements OnInit {
  @Input() defaultService?: string;
  @Output() closed = new EventEmitter<void>();

  categories: CategoryType[] = [];
  formData: ServiceRequestType = { service: '', name: '', phone: '' };
  loading = false;
  isSuccess = false;
  errorMessage: string | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private requestsService: RequestsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
    if (this.defaultService) {
      this.formData.service = this.defaultService;
    }
  }

  loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this._snackBar.open('Ошибка загрузки списка услуг', 'Закрыть', { duration: 3000 })
    });
  }

  isNameValid(): boolean {
    return /^[А-Яа-яЁёA-Za-z\s]{2,}$/.test(this.formData.name.trim());
  }

  isPhoneValid(): boolean {
    return /\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/.test(this.formData.phone);
  }

  onPhoneInput(event: Event) {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.startsWith('7')) value = value.slice(1);
    let masked = '+7 ';
    if (value.length > 0) masked += '(' + value.substring(0, 3);
    if (value.length >= 4) masked += ') ' + value.substring(3, 6);
    if (value.length >= 7) masked += '-' + value.substring(6, 8);
    if (value.length >= 9) masked += '-' + value.substring(8, 10);
    this.formData.phone = masked;
  }

  submit() {
    this.errorMessage = null;

    if (!this.isNameValid() || !this.isPhoneValid() || !this.formData.service) {
      this._snackBar.open('Проверьте корректность введённых данных', 'Закрыть', { duration: 3000 });
      return;
    }

    this.loading = true;

    this.requestsService.sendRequest({ ...this.formData, type: 'order' }).subscribe({
      next: (res) => {
        if (!res.error) {
          this.isSuccess = true;
          this._snackBar.open(res.message, 'Закрыть', { duration: 3000 });
        } else {
          this.errorMessage = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
          this._snackBar.open(res.message, 'Закрыть', { duration: 3000 });
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
        this._snackBar.open('Ошибка при отправке заявки', 'Закрыть', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  close() {
    this.isSuccess = false;
    this.formData = { service: '', name: '', phone: '' };
    this.errorMessage = null;
    this.closed.emit();
  }
}
