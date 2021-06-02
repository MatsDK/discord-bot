import { useCallback, useState } from "react";

export const useInput = <T extends any>(
  initialValue: T
): [T, (e: any) => void] => {
  const [state, setState] = useState<T>(initialValue);
  const onChange = useCallback((e) => {
    setState(e.currentTarget.value);
  }, []);

  return [state, onChange];
};
