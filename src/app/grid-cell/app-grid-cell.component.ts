import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

import { GridCell } from '../grid.service';

export type Ingredient = "T" | "M";

@Component({
  selector: "app-grid-cell",
  templateUrl: "./app-grid-cell.component.html",
  styleUrls: ["./app-grid-cell.component.scss"],
  animations: [
    trigger("cut", [
      // ...
      state(
        "true",
        style({
          opacity: 0.4
        })
      ),
      state(
        "false",
        style({
          opacity: 1
        })
      ),
      transition("false => true", [animate(".6s")])
    ])
  ]
})
export class AppGridCellComponent {
  @Input() cell: GridCell | undefined;
  @Input() shouldDisplayText: boolean | undefined;
}
