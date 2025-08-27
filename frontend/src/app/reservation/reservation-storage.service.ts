import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReservationStorageService {
  private key(id:number) { return `reservation_draft_${id}`; }

  load(id:number): any | null {
    const raw = localStorage.getItem(this.key(id));
    return raw ? JSON.parse(raw) : null;
  }

  save(id:number, data:any){
    localStorage.setItem(this.key(id), JSON.stringify(data));
  }

  clear(id:number){ localStorage.removeItem(this.key(id)); }
}
