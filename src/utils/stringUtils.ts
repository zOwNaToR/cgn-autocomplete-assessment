import { arrayToObject } from './arrayUtils';

type cxObject = Record<string, boolean | undefined | null>;

export const cx = (...params: (string | cxObject)[]) => {
	const objectArray = params.filter((x) => typeof x === 'object') as cxObject[];
	const objects = arrayToObject(objectArray);
	const strings = params.filter((x) => typeof x === 'string');

	const flattenedStrings = strings.filter((x) => !!x).join(' ');
	const flattenedObjects = Object.entries(objects)
		.filter(([, value]) => !!value)
		.map(([key]) => key)
		.join(' ');

	return `${flattenedStrings} ${flattenedObjects}`;
};
