import { useEffect, useState } from 'react';
import useForceRender from '../useForceRender';

export let cachedQueries: Record<string, any> = {};

type useQueryParams<T> = {
	key: string;
	queryFn: (signal: AbortSignal) => Promise<T>;
	enabled?: boolean;
};

const useQuery = <T>({ key, queryFn, enabled = true }: useQueryParams<T>) => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [data, setData] = useState<T | undefined>(undefined);
	const [forceFetchCount, forceRerender] = useForceRender()

	useEffect(() => {
		if (!enabled) {
			remove()
			return
		}

		const abortController = new AbortController();

		fetchData(false, abortController.signal);

		return () => {
			abortController.abort();
		};
	}, [key, enabled, forceFetchCount]);

	const fetchData = (forceRefetch: boolean, signal: AbortSignal) => {
		setIsLoading(true);
		const hasDataInCache = typeof cachedQueries[key] !== 'undefined';

		if (!forceRefetch && hasDataInCache) {
			handleSetData(cachedQueries[key], false);
			return;
		}

		queryFn(signal)
			.then((json) => handleSetData(json, true))
			.catch((err: Error) => handleSetError(err.message || err.toString()));
	};

	const remove = () => {
		if (key in cachedQueries){
			delete cachedQueries[key];
		}
		handleSetData(undefined, false);
	};

	const handleSetData = (dataToSet: T | undefined, updateCache: boolean) => {
		if (updateCache) {
			cachedQueries[key] = dataToSet
		}
		
		setData(dataToSet);
		setIsLoading(false);
		setError('');
	};

	const handleSetError = (error: string) => {
		setData(undefined);
		setIsLoading(false);
		setError(error);
	};

	return {
		isLoading,
		error,
		isError: !!error,
		data,
		refetch: forceRerender,
		remove,
	};
};

export default useQuery;
