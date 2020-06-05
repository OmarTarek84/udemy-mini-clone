import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private sidenav: MatSidenav;
  loading = false;
  loadingChanged = new Subject<{loading: boolean, text: string}>();

  constructor() {}

  loadingTrue(text) {
    this.loading = true;
    this.loadingChanged.next({loading: true, text: text});
  }

  loadingFalse() {
    this.loading = false;
    this.loadingChanged.next({loading: false, text: 'Done'});
  }

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  toggle(): void {
    this.sidenav.toggle();
  }

  closeSidenav() {
    this.sidenav.close();
  }
}
