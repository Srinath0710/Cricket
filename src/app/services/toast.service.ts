import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private msgService: MessageService) {}

  successToast(data: any) {
    this.msgService.add({
      severity: 'success',
      summary: 'Success',
      detail: data.message,
      life: 800,
      data: { image: 'assets/images/default-logo.png' }
    });
  }

  failedToast(data: any) {
    this.msgService.add({
      severity: 'error',
      summary: 'Error',
      detail: data.message,
      life: 800,
      data: { image: 'assets/images/default-logo.png' }
    });
  }
}
