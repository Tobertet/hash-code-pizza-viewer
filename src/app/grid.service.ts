import { Injectable } from '@angular/core';

import { Ingredient } from './grid-cell/app-grid-cell.component';

export interface HeaderData {
  rows: number;
  columns: number;
  minIngredients: number;
  maxSliceSize: number;
}

export interface SliceCut {
  startingRow: number;
  endingRow: number;
  startingColumn: number;
  endingColumn: number;
}

export interface GridCell {
  ingredient: Ingredient;
  isCut: boolean;
  hasBorderTop: boolean;
  hasBorderBottom: boolean;
  hasBorderLeft: boolean;
  hasBorderRight: boolean;
}

@Injectable()
export class GridService {
  rows: number = 0;
  columns: number = 0;
  minIngredients: number = 0;
  maxSliceSize: number = 0;

  grid: GridCell[][] = [];
  sliceCuts: SliceCut[] = [];

  cutCellsCount: number = 0;

  setHeaderInfo(headerInfo: HeaderData) {
    this.rows = headerInfo.rows;
    this.columns = headerInfo.columns;
    this.minIngredients = headerInfo.minIngredients;
    this.maxSliceSize = headerInfo.maxSliceSize;
    this.cutCellsCount = 0;
  }

  setGridInfo(grid: GridCell[][]) {
    this.grid = grid;
  }

  setSliceCuts(sliceCuts: SliceCut[]) {
    this.sliceCuts = sliceCuts;
    this.cutCellsCount = 0;
  }

  resetContent() {
    this.rows = 0;
    this.columns = 0;
    this.minIngredients = 0;
    this.maxSliceSize = 0;
    this.grid = [];
    this.cutCellsCount = 0;
  }

  cutSlice(step: number): boolean {
    const sliceToCut = this.sliceCuts[step];
    if (isNaN(sliceToCut.endingColumn)) {
      return false;
    }
    for (
      let startingRow = sliceToCut.startingRow;
      startingRow <= sliceToCut.endingRow;
      startingRow++
    ) {
      for (
        let startingColumn = sliceToCut.startingColumn;
        startingColumn <= sliceToCut.endingColumn;
        startingColumn++
      ) {
        this.grid[startingRow][startingColumn].isCut = true;
        if (startingRow === sliceToCut.startingRow) {
          this.grid[startingRow][startingColumn].hasBorderTop = true;
        }
        if (startingColumn === sliceToCut.startingColumn) {
          this.grid[startingRow][startingColumn].hasBorderLeft = true;
        }
        if (startingRow === sliceToCut.endingRow) {
          this.grid[startingRow][startingColumn].hasBorderBottom = true;
        }
        if (startingColumn === sliceToCut.endingColumn) {
          this.grid[startingRow][startingColumn].hasBorderRight = true;
        }
      }
    }
    this.cutCellsCount =
      this.cutCellsCount +
      (sliceToCut.endingColumn - sliceToCut.startingColumn + 1) *
        (sliceToCut.endingRow - sliceToCut.startingRow + 1);
    return true;
  }

  restart() {
    this.cutCellsCount = 0;
    this.grid.forEach(row => {
      row.forEach(cell => {
        cell.isCut = false;
        cell.hasBorderTop = false;
        cell.hasBorderBottom = false;
        cell.hasBorderLeft = false;
        cell.hasBorderRight = false;
      });
    });
  }
}
