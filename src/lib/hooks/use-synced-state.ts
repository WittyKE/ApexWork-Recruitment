"use client";

import * as React from "react";

/**
 * Local state that re-derives itself when `value` changes identity (e.g. a
 * server prop refreshed by revalidatePath after a Server Action), while
 * staying independently mutable in between. Adjusts state during render
 * instead of in a useEffect, per React's "adjusting state when a prop
 * changes" pattern — avoids the extra commit + cascading render an effect
 * would cause.
 */
export function useSyncedState<T>(value: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [prevValue, setPrevValue] = React.useState(value);
  const [state, setState] = React.useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setState(value);
  }

  return [state, setState];
}
