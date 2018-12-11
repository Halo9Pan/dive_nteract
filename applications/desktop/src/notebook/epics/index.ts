import { Observable } from "rxjs";
import { catchError, startWith } from "rxjs/operators";
import { epics as coreEpics } from "@nteract/core";
import { DesktopNotebookAppState } from "../state";
import { Epic, ActionsObservable, StateObservable } from "redux-observable";

import { saveEpic, saveAsEpic } from "./saving";
import {
  updateContentEpic,
  fetchContentEpic,
  newNotebookEpic,
  launchKernelWhenNotebookSetEpic
} from "./loading";
import {
  launchKernelEpic,
  launchKernelByNameEpic,
  interruptKernelEpic,
  killKernelEpic,
  watchSpawn
} from "./zeromq-kernels";
import { publishEpic } from "./github-publish";
import {
  loadConfigEpic,
  saveConfigEpic,
  saveConfigOnChangeEpic
} from "./config";
import { closeNotebookEpic } from "./close-notebook";

import { Actions } from "../actions";

export function retryAndEmitError(err: Error, source: Observable<Actions>) {
  console.error(err);
  return source.pipe(startWith({ type: "ERROR", payload: err, error: true }));
}

export const wrapEpic = (epic: Epic<Actions, Actions>) => (
  ...args: [
    ActionsObservable<Actions>,
    StateObservable<DesktopNotebookAppState>,
    undefined
  ]
) => epic(...args).pipe(catchError(retryAndEmitError));

const epics = [
  coreEpics.restartKernelEpic,
  coreEpics.acquireKernelInfoEpic,
  coreEpics.watchExecutionStateEpic,
  coreEpics.executeCellEpic,
  coreEpics.updateDisplayEpic,
  coreEpics.commListenEpic,
  coreEpics.executeAllCellsEpic,

  launchKernelWhenNotebookSetEpic,
  watchSpawn,
  publishEpic,
  saveEpic,
  saveAsEpic,
  updateContentEpic,
  fetchContentEpic,
  newNotebookEpic,
  launchKernelEpic,
  launchKernelByNameEpic,
  interruptKernelEpic,
  killKernelEpic,
  loadConfigEpic,
  saveConfigEpic,
  saveConfigOnChangeEpic,
  closeNotebookEpic
];

export default epics.map<Epic<Actions, Actions, DesktopNotebookAppState>>(
  epic => wrapEpic((epic as unknown) as any)
);
