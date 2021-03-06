import * as Immutable from "immutable";

import { BaseHostProps } from "./base";

export type LocalHostRecordProps = BaseHostProps & {
  type: "local";
};

export const makeLocalHostRecord = Immutable.Record<LocalHostRecordProps>({
  type: "local",
  id: null,
  defaultKernelName: "python",
  bookstoreEnabled: false
});

export type LocalHostRecord = Immutable.RecordOf<LocalHostRecordProps>;
