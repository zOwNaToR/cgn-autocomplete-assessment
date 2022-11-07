export const arrayToObject = (arr: Record<string, any>[]) =>
	arr.reduce((curr, acc) => {
		acc[curr[0]] = curr[1];
		return acc;
	}, {});
