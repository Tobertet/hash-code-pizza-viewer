import { Component } from '@angular/core';

import { DataSetsService } from './data-sets.service';
import { ExecutionService } from './execution.service';
import { GridService } from './grid.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly dataSetsService: DataSetsService,
    private readonly gridService: GridService
  ) {}

  get inputDataSetFileName() {
    return this.dataSetsService.inputDataSetFileName || "";
  }

  get outputDataSetFileName() {
    return this.dataSetsService.outputDataSetFileName || "";
  }

  get gridRows() {
    return this.gridService.rows;
  }

  get gridColumns() {
    return this.gridService.columns;
  }

  get minIngredients() {
    return this.gridService.minIngredients;
  }

  get maxSliceSize() {
    return this.gridService.maxSliceSize;
  }

  get cutCellsCount() {
    return this.gridService.cutCellsCount;
  }

  get isInputDataLoaded() {
    return this.dataSetsService.inputDataSetFileName !== undefined;
  }

  get grid() {
    return this.gridService.grid;
  }

  getInputDataSetFile(event: any) {
    const file = (event.target.files[0] as unknown) as File;
    this.dataSetsService.readInputDataSetFile(file);
  }

  getOutputDataSetFile(event: any) {
    const file = (event.target.files[0] as unknown) as File;
    this.dataSetsService.readOutputDataSetFile(file);
  }

  canBeStarted(): boolean {
    return (
      this.dataSetsService.areDataSetsLoaded() &&
      !this.executionService.isStarted
    );
  }

  canBePaused(): boolean {
    return (
      this.dataSetsService.areDataSetsLoaded() &&
      this.executionService.isStarted
    );
  }

  canBeStopped(): boolean {
    return (
      this.dataSetsService.areDataSetsLoaded() &&
      !this.executionService.isStopped
    );
  }

  getGridColumnsForCss(): string {
    return "auto ".repeat(this.gridService.columns);
  }

  start() {
    this.executionService.start();
  }

  pause() {
    this.executionService.pause();
  }

  stop() {
    this.executionService.stop();
  }
}
