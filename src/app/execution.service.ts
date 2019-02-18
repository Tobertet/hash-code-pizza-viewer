import { Injectable } from '@angular/core';


export enum ExecutionStatus {
  PAUSED,
  STARTED,
  STOPPED
}

@Injectable()
export class ExecutionService {
  private _status: ExecutionStatus = ExecutionStatus.STOPPED;
  private _currentStep: number = 0;

  get status() {
    return this._status;
  }
}
