import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { GridService } from './grid.service';

enum ExecutionStates {
  PAUSED,
  STARTED,
  STOPPED
}

@Injectable()
export class ExecutionService {
  private _state: ExecutionStates = ExecutionStates.STOPPED;
  private _currentStep: number = 0;

  private _executionStopper = new Subject<undefined>();

  get isStarted() {
    return this._state === ExecutionStates.STARTED;
  }

  get isPaused() {
    return this._state === ExecutionStates.PAUSED;
  }

  get isStopped() {
    return this._state === ExecutionStates.STOPPED;
  }

  constructor(private readonly gridService: GridService) {}

  start() {
    this._state = ExecutionStates.STARTED;
    interval(1500)
      .pipe(
        startWith(1),
        takeUntil(this._executionStopper.asObservable()),
        filter(value => value % 2 === 1),
        map(() => this._currentStep),
        tap(step => {
          this._currentStep++;
        }),
        tap(step => {
          const isCutValid = this.gridService.cutSlice(step);
          if (!isCutValid) {
            this.stop();
          }
        })
      )
      .subscribe();
  }

  pause() {
    this._state = ExecutionStates.PAUSED;
    this._executionStopper.next();
  }

  stop() {
    this._state = ExecutionStates.STOPPED;

    this._executionStopper.next();
    this._currentStep = 0;

    this.gridService.restart();
  }
}
