import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatInputModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DataSetsService } from './data-sets.service';
import { ExecutionService } from './execution.service';
import { AppGridCellComponent } from './grid-cell/app-grid-cell.component';
import { GridService } from './grid.service';

@NgModule({
  declarations: [AppComponent, AppGridCellComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [ExecutionService, DataSetsService, GridService],
  bootstrap: [AppComponent]
})
export class AppModule {}
