import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { removeObjectKeys } from '../../utils/objectUtils';
import useQuery, { cachedQueries } from './useQuery';

type useQueryReturnType = RenderHookResult<ReturnType<typeof useQuery>, unknown> | undefined;

describe('useQuery', () => {
	afterEach(() => {
		jest.clearAllMocks();
		removeObjectKeys(cachedQueries);
	});

	describe('return data', () => {
      it('returns correct data with successful promise', async () => {
         const spy = jest.fn(() => Promise.resolve(['Ciao', 'Come stai?']));
   
         let hook: useQueryReturnType;
   
         await act(async () => {
            hook = renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         expect(hook?.result.current.data).toEqual(['Ciao', 'Come stai?']);
      });

      it('returns cached data when useQuery is invoked 2 times with same key but different queryFn', async () => {
         const spy1 = jest.fn(() => Promise.resolve(['Ciao', 'Come stai?']));
         const spy2 = jest.fn(() => Promise.resolve(['Other data']));
   
         let hook1: useQueryReturnType;
         let hook2: useQueryReturnType;
   
         await act(async () => {
            hook1 = renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy1(),
                  enabled: true,
               })
            );
         });
   
         await act(async () => {
            hook2 = renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy1(),
                  enabled: true,
               })
            );
         });
   
         expect(hook1?.result.current.data).toEqual(['Ciao', 'Come stai?']);
         expect(hook2?.result.current.data).toEqual(['Ciao', 'Come stai?']);
      });

      it('returns an error when promise is rejected', async () => {
         const spy = jest.fn(() => Promise.reject('Something went wrong with this promise.'));
   
         let hook: useQueryReturnType;
   
         await act(async () => {
            hook = renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         expect(hook?.result.current.isError).toBe(true);
         expect(hook?.result.current.error).toBe('Something went wrong with this promise.');
         expect(hook?.result.current.data).toBeUndefined();
      });
   });

	describe('how many times query function is called', () => {
      it('calls the query function 1 time', async () => {
         const spy = jest.fn(() => Promise.resolve(['Ciao', 'Come stai?']));
   
         await act(async () => {
            const result = renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         expect(spy).toHaveBeenCalledTimes(1);
      });

      it('calls the query function 1 time when useQuery is invoked 2 times with same key', async () => {
         const spy = jest.fn(() => Promise.resolve(['Ciao', 'Come stai?']));
   
         await act(async () => {
            renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         await act(async () => {
            renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         expect(spy).toHaveBeenCalledTimes(1);
      });

      it('calls the query function 2 times when useQuery is invoked 2 times with different keys', async () => {
         const spy = jest.fn(() => Promise.resolve(['Ciao', 'Come stai?']));
   
         await act(async () => {
            renderHook(() =>
               useQuery({
                  key: 'myKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         await act(async () => {
            renderHook(() =>
               useQuery({
                  key: 'differentKey',
                  queryFn: async () => await spy(),
                  enabled: true,
               })
            );
         });
   
         expect(spy).toHaveBeenCalledTimes(2);
      });
   });
});
