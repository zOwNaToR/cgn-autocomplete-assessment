export const cloneObjectAndRemoveKeys = (object: Record<string, any>) => {
	const cloned = { ...object };

	removeObjectKeys(cloned)

	return cloned;
};

export const removeObjectKeys = (object: Record<string, any>) => {
	Object.keys(object).forEach((key) => delete object[key]);
};
