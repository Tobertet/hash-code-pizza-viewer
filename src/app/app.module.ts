import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatInputModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppGridCellComponent } from './grid-cell/app-grid-cell.component';

@NgModule({
  declarations: [AppComponent, AppGridCellComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
