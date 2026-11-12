type Sheet = {
  present: (index: number, animated: boolean) => Promise<void>;
  dismiss: (animated: boolean) => Promise<void>;
};

export function createCardSearchSheet() {
  let sheet: Sheet | null = null;
  let focused = false;
  let presented = false;
  let pending = Promise.resolve();
  let generation = 0;

  const enqueue = (operation: () => Promise<void>) => {
    const current = generation;
    const result = pending.then(() => {
      if (current === generation) return operation();
    });
    pending = result.catch(() => {});
    return result;
  };

  const show = async () => {
    if (!sheet || !focused || presented) return;
    const current = generation;
    await sheet.present(0, false);
    if (current === generation) presented = true;
  };

  const hide = async () => {
    if (!sheet || !presented) return;
    const current = generation;
    await sheet.dismiss(false);
    if (current === generation) presented = false;
  };

  return {
    attach(handle: Sheet | null) {
      generation++;
      pending = Promise.resolve();
      sheet = handle;
      presented = false;
      if (!handle) focused = false;
    },
    setFocused(value: boolean) {
      focused = value;
      // Reconcile the latest focus after any native transition finishes.
      return enqueue(() => (focused ? show() : hide()));
    },
    hide: () => enqueue(hide),
    restore: () => enqueue(show),
    didDismiss() {
      presented = false;
    },
  };
}

export const cardSearchSheet = createCardSearchSheet();
