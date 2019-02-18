import { Component } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { map, startWith, takeUntil, tap } from 'rxjs/operators';

import { Ingredient } from './grid-cell/app-grid-cell.component';

type Solution = {
  startingRow: number;
  startingColumn: number;
  endingRow: number;
  endingColumn: number;
};

export type GridCell = {
  ingredient: Ingredient;
  isCut: boolean;
  borderTop: boolean;
  borderBottom: boolean;
  borderLeft: boolean;
  borderRight: boolean;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  inputDataSetFileName = "";
  outputDataSetFileName = "";

  stopper = new Subject<undefined>();

  gridRows: string = "?";
  gridColumns: string = "?";

  minIngredients: string = "?";
  maxSliceSize: string = "?";

  total: number = 0;

  isInputDataLoaded: boolean = false;
  isOutputDataLoaded: boolean = false;

  grid: GridCell[][] = [];

  solutions: Solution[] = [];

  currentStep: number = 0;

  isStarted = false;
  isPaused = false;
  isStopped = true;

  getInputDataSetFile(event: any) {
    const file = (event.target.files[0] as unknown) as File;
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      this.inputDataSetFileName = file.name;
      const [dataRow, ...gridRows] = (fileReader.result as string).split("\n");
      [
        this.gridRows,
        this.gridColumns,
        this.minIngredients,
        this.maxSliceSize
      ] = dataRow.split(" ");
      this.grid = [];
      gridRows.forEach((row, index) => {
        this.grid[index] = (row.split("") as Ingredient[]).map<GridCell>(
          ingredient => ({
            ingredient,
            isCut: false,
            borderBottom: false,
            borderLeft: false,
            borderRight: false,
            borderTop: false
          })
        );
      });
      this.isInputDataLoaded = true;
    };
    fileReader.readAsText(file);
  }

  getOutputDataSetFile(event: any) {
    const file = (event.target.files[0] as unknown) as File;
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      this.outputDataSetFileName = file.name;
      const [rowsCount, ...solutionRows] = (fileReader.result as string).split(
        "\n"
      );
      solutionRows.forEach((solution, index) => {
        if (index < parseInt(rowsCount)) {
          const parsedSolution = solution.split(" ");
          this.solutions[index] = {
            startingRow: parseInt(parsedSolution[0]),
            startingColumn: parseInt(parsedSolution[1]),
            endingRow: parseInt(parsedSolution[2]),
            endingColumn: parseInt(parsedSolution[3])
          };
        }
      });
      this.isOutputDataLoaded = true;
    };
    fileReader.readAsText(file);
  }

  canBeStarted(): boolean {
    return (
      this.isInputDataLoaded &&
      this.isOutputDataLoaded &&
      (this.isStopped || this.isPaused)
    );
  }

  canBePaused(): boolean {
    return this.isInputDataLoaded && this.isOutputDataLoaded && this.isStarted;
  }

  canBeStopped(): boolean {
    return (
      this.isInputDataLoaded &&
      this.isOutputDataLoaded &&
      (this.isStarted || this.isPaused)
    );
  }
  getGridColumnsForCss(): string {
    return "auto ".repeat(parseInt(this.gridColumns));
  }

  start() {
    interval(1500)
      .pipe(
        startWith(null),
        takeUntil(this.stopper.asObservable()),
        map(count => this.currentStep),
        tap(step => {
          const solutionToApply = this.solutions[step];
          for (
            let startingRow = solutionToApply.startingRow;
            startingRow <= solutionToApply.endingRow;
            startingRow++
          ) {
            for (
              let startingColumn = solutionToApply.startingColumn;
              startingColumn <= solutionToApply.endingColumn;
              startingColumn++
            ) {
              this.grid[startingRow][startingColumn].isCut = true;
              if (startingRow === solutionToApply.startingRow) {
                this.grid[startingRow][startingColumn].borderTop = true;
              }
              if (startingColumn === solutionToApply.startingColumn) {
                this.grid[startingRow][startingColumn].borderLeft = true;
              }
              if (startingRow === solutionToApply.endingRow) {
                this.grid[startingRow][startingColumn].borderBottom = true;
              }
              if (startingColumn === solutionToApply.endingColumn) {
                this.grid[startingRow][startingColumn].borderRight = true;
              }
            }
          }
          this.total =
            this.total +
            (solutionToApply.endingColumn -
              solutionToApply.startingColumn +
              1) *
              (solutionToApply.endingRow - solutionToApply.startingRow + 1);
        }),
        tap(() => {
          this.isStarted = true;
          this.isPaused = false;
          this.isStopped = false;
        }),
        tap(step => this.currentStep++)
      )
      .subscribe();
  }

  pause() {
    this.isStarted = false;
    this.isPaused = true;
    this.isStopped = false;
    this.stopper.next();
  }

  stop() {
    this.isStarted = false;
    this.isStopped = true;
    this.isPaused = false;
    this.stopper.next();
    this.currentStep = 0;
    this.total = 0;
    this.grid.forEach(row => {
      row.forEach(cell => {
        cell.isCut = false;
        cell.borderTop = false;
        cell.borderBottom = false;
        cell.borderLeft = false;
        cell.borderRight = false;
      });
    });
  }
}
