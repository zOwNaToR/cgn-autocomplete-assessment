import { renderHook, RenderHookResult } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { Key } from '../../utils/constants'
import useVerticalKeyboardNavigation from './useVerticalKeyboardNavigation';

type useVerticalKeyboardNavigationReturnType =
	| RenderHookResult<ReturnType<typeof useVerticalKeyboardNavigation>, unknown>
	| undefined;

describe('useQuery', () => {
	describe('navigateBottom and navigateTop', () => {
		it('starts with index -1', async () => {
			let hook: useVerticalKeyboardNavigationReturnType;

			await act(async () => {
				hook = renderHook(() =>
					useVerticalKeyboardNavigation({
						topLimit: 0,
						bottomLimit: 3,
					})
				);
			});

			expect(hook?.result.current.index).toEqual(-1);
		});

		it('increase index until bottom limit', async () => {
			let hook: useVerticalKeyboardNavigationReturnType;

			await act(async () => {
				hook = renderHook(() =>
					useVerticalKeyboardNavigation({
						topLimit: 0,
						bottomLimit: 3,
					})
				);
			});

			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});

			expect(hook?.result.current.index).toEqual(3);
		});

		it('does not increase index over bottom limit', async () => {
			let hook: useVerticalKeyboardNavigationReturnType;

			await act(async () => {
				hook = renderHook(() =>
					useVerticalKeyboardNavigation({
						topLimit: 0,
						bottomLimit: 3,
					})
				);
			});

			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});

			expect(hook?.result.current.index).toEqual(3);
		});

		it('does not decrease index over top limit', async () => {
			let hook: useVerticalKeyboardNavigationReturnType;

			await act(async () => {
				hook = renderHook(() =>
					useVerticalKeyboardNavigation({
						topLimit: 0,
						bottomLimit: 3,
					})
				);
			});

			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateBottom();
			});
			act(() => {
				hook?.result.current.navigateUp();
			});
			act(() => {
				hook?.result.current.navigateUp();
			});
			act(() => {
				hook?.result.current.navigateUp();
			});

			expect(hook?.result.current.index).toEqual(0);
		});
	});

	describe('handleKeyDown', () => {
		it('increase correctly on arrow down', async () => {
			let hook: useVerticalKeyboardNavigationReturnType;

			await act(async () => {
				hook = renderHook(() =>
					useVerticalKeyboardNavigation({
						topLimit: 0,
						bottomLimit: 3,
					})
				);
			});

			act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowDown);
			});
			act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowDown);
			});
         act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowDown);
			});

			expect(hook?.result.current.index).toEqual(2);
		});
		
      it('decrease correctly on arrow up', async () => {
			let hook: useVerticalKeyboardNavigationReturnType;

			await act(async () => {
				hook = renderHook(() =>
					useVerticalKeyboardNavigation({
						topLimit: 0,
						bottomLimit: 3,
					})
				);
			});

			act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowDown);
			});
			act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowDown);
			});
         act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowDown);
			});
         act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowUp);
			});
         act(() => {
				hook?.result.current.handleKeyDown(Key.ArrowUp);
			});

			expect(hook?.result.current.index).toEqual(0);
		});
	});
});
