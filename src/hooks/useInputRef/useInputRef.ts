import { useCallback, useMemo, useRef } from 'react';
import useForceRender from '../useForceRender';

type useInputRefParams = {
	forwardRef?: React.ForwardedRef<HTMLInputElement>;
};

const useInputRef = ({ forwardRef }: useInputRefParams) => {
   const [, forceRerender] = useForceRender()
   const inputRef = useRef<HTMLInputElement | null>(null);

   const getValue = useCallback(() => inputRef.current?.value ?? '', [])

   const setValue = useCallback((value: string, shouldForceRerender: boolean) => {
      if (inputRef.current) {
         inputRef.current.value = value
         
         if (shouldForceRerender) forceRerender()
      }
   }, [forceRerender])

   const register = useCallback((node: HTMLInputElement | null) => {
      if (typeof forwardRef === "undefined") return inputRef

      inputRef.current = node;

      if (typeof forwardRef === 'function') {
         forwardRef(node);
      } else if (forwardRef) {
         forwardRef.current = node;
      }
   }, [forwardRef])

   return useMemo(() => ({
      register,
      getValue,
      setValue,
   }), [register, getValue, setValue])
};

export default useInputRef;
