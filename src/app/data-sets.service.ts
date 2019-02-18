import { Injectable } from '@angular/core';

import { Ingredient } from './grid-cell/app-grid-cell.component';
import { GridCell, GridService, SliceCut } from './grid.service';

@Injectable()
export class DataSetsService {
  inputDataSetFileName: string | undefined;
  outputDataSetFileName: string | undefined;

  constructor(private readonly gridService: GridService) {}

  private getHeaderData(rawHeaderData: string) {
    const [rows, columns, minIngredients, maxSliceSize] = rawHeaderData
      .split(" ")
      .map(stringValue => parseInt(stringValue));

    return {
      rows,
      columns,
      minIngredients,
      maxSliceSize
    };
  }

  private getGridData(rawGridData: string[]): GridCell[][] {
    return rawGridData.map(rawRowData =>
      (rawRowData.split("") as Ingredient[]).map<GridCell>(ingredient => ({
        ingredient,
        isCut: false,
        hasBorderBottom: false,
        hasBorderLeft: false,
        hasBorderRight: false,
        hasBorderTop: false
      }))
    );
  }

  private getSliceCutsData(rawSliceCuts: string[]): SliceCut[] {
    return rawSliceCuts.map(rawSliceCut => {
      const sliceCut = rawSliceCut.split(" ");
      return {
        startingRow: parseInt(sliceCut[0]),
        startingColumn: parseInt(sliceCut[1]),
        endingRow: parseInt(sliceCut[2]),
        endingColumn: parseInt(sliceCut[3])
      };
    });
  }

  readInputDataSetFile(file: File) {
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const [
          rawHeaderData,
          ...rawGridData
        ] = (fileReader.result as string).split("\n");

        const headerData = this.getHeaderData(rawHeaderData);
        this.gridService.setHeaderInfo(headerData);

        const gridData = this.getGridData(rawGridData);
        this.gridService.setGridInfo(gridData);

        this.inputDataSetFileName = file.name;
      } catch (e) {
        alert("The content of the input set file is not valid");
        this.inputDataSetFileName = undefined;
        this.gridService.resetContent();
      }
    };
    fileReader.readAsText(file);
  }

  readOutputDataSetFile(file: File) {
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const [
          rawCellsCutCount,
          ...rawSliceCuts
        ] = (fileReader.result as string).split("\n");

        const sliceCutsData = this.getSliceCutsData(rawSliceCuts);
        this.gridService.setSliceCuts(sliceCutsData);

        this.outputDataSetFileName = file.name;
      } catch (e) {
        alert("The content of the output set file is not valid");
        this.outputDataSetFileName = undefined;
      }
    };
    fileReader.readAsText(file);
  }

  areDataSetsLoaded() {
    return (
      this.inputDataSetFileName !== undefined &&
      this.outputDataSetFileName !== undefined
    );
  }
}
