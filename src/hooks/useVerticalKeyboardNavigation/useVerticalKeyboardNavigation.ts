import { useState } from 'react';
import { Key } from '../../utils/constants'

type useVerticalKeyboardNavigationParams = {
	topLimit: number;
	bottomLimit: number;
};

const useVerticalKeyboardNavigation = ({
	topLimit,
	bottomLimit,
}: useVerticalKeyboardNavigationParams) => {
	const [index, setIndex] = useState(-1);

	const upperLimitReached = index <= topLimit;
	const lowerLimitReached = index === bottomLimit;

	const resetIndex = () => setIndex(-1);

	const navigateUp = () => {
		if (upperLimitReached) return -1;

		const nextIndex = index - 1;
		setIndex(nextIndex);

		return nextIndex;
	};

	const navigateBottom = () => {
		if (lowerLimitReached) return -1;

		const nextIndex = index + 1;
		setIndex(nextIndex);

		return nextIndex;
	};

	const handleKeyDown = (eventCode: string) => {
		if (eventCode === Key.ArrowUp) return navigateUp();
		if (eventCode === Key.ArrowDown) return navigateBottom();

		return -1;
	};

	return {
		index,
		navigateUp,
		navigateBottom,
		resetIndex,
		handleKeyDown,
	};
};

export default useVerticalKeyboardNavigation;
