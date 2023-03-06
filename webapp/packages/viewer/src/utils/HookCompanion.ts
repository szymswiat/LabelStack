import { useEffect, useState } from 'react';

class HookCompanion<T> {
  props: T;

  triggerHookUpdate: () => void;

  constructor(props: T) {
    this.props = props;
  }

  mount() {}

  unmount() {}
}

function useHookCompanion<T extends HookCompanion<P>, P>(
  companionConstructor: new (props: P) => T,
  companionProps: P,
  beforeMountCallback?: (companion: T) => void,
  beforeUnmountCallback?: (companion: T) => void
): T | null {
  const [companion, setCompanion] = useState<T | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  useEffect(() => {
    const newCompanion = new companionConstructor(companionProps);
    if (beforeMountCallback) {
      beforeMountCallback(newCompanion);
    }
    newCompanion.triggerHookUpdate = () => setUpdateTrigger(Date.now());
    newCompanion.mount();
    setCompanion(newCompanion);

    return () => {
      if (beforeUnmountCallback) {
        beforeUnmountCallback(newCompanion);
      }
      newCompanion.unmount();
    };
  }, []);

  if (companion) {
    companion.props = companionProps;
  }

  return companion;
}

export default HookCompanion;

export { useHookCompanion };
