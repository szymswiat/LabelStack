import React, { EffectCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function usePrevious<T>(value: T, initialValue: T): T {
  const ref = useRef<T>(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const useEffectDebug = (
  effectHook: EffectCallback,
  dependencies: any[],
  name: string,
  dependencyNames: string[] = []
) => {
  const previousDeps = usePrevious(dependencies, []);

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency
        }
      };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log(`[use_effect_debug - ${name}] `, changedDeps);
  }

  useEffect(effectHook, dependencies);
};

const useEffectNonNull = (effect: EffectCallback, deps: any[], nonNullDeps: any[]) => {
  useEffect(() => {
    for (const dep of nonNullDeps) {
      if (dep == null) {
        return;
      }
    }
    return effect();
  }, [...deps, ...nonNullDeps]);
};

function useLocalStorage<T>(key, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

function useDocumentTitle(title, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    []
  );
}

export { useQuery, usePrevious, useEffectDebug, useEffectNonNull, useLocalStorage, useDocumentTitle };
