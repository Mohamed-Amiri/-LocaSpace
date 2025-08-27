import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast { message:string; type:'success'|'error'|'info'; id:number; }

@Injectable({ providedIn:'root' })
export class ToastService {
  private counter=0;
  private _toasts = new Subject<Toast[]>();
  toasts$ = this._toasts.asObservable();
  private list: Toast[] = [];

  show(message:string,type:'success'|'error'|'info'='info'){
    const toast:Toast = { message,type,id:++this.counter };
    this.list.push(toast);
    this._toasts.next(this.list);
    setTimeout(()=>this.dismiss(toast.id),3000);
  }

  dismiss(id:number){
    this.list = this.list.filter(t=>t.id!==id);
    this._toasts.next(this.list);
  }
}
