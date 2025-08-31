import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-callback-modal',
  templateUrl: './callback-modal.component.html',
  styleUrl: './callback-modal.component.scss'
})
export class CallbackModalComponent {
  name = '';
  phone = '';
  isSuccess = false;

  @Output() closed = new EventEmitter<void>();

  isNameValid(): boolean {
    return /^[А-Яа-яЁёA-Za-z\s]{2,}$/.test(this.name.trim());
  }

  isPhoneValid(): boolean {
    return /\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/.test(this.phone);
  }

  onPhoneInput(event: Event) {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.startsWith('7')) {
      value = value.slice(1);
    }
    let masked = '+7 ';
    if (value.length > 0) masked += '(' + value.substring(0, 3);
    if (value.length >= 4) masked += ') ' + value.substring(3, 6);
    if (value.length >= 7) masked += '-' + value.substring(6, 8);
    if (value.length >= 9) masked += '-' + value.substring(8, 10);
    this.phone = masked;
  }

  submit() {
    if (this.isNameValid() && this.isPhoneValid()) {
      this.isSuccess = true;
    }
  }

  close() {
    this.isSuccess = false;
    this.name = '';
    this.phone = '';
    this.closed.emit();
  }
}
