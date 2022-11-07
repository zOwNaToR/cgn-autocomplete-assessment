export type PublicApisResponse = {
	count: number;
	entries: PublicApisItem[] | null;
};

export type PublicApisItem = {
	API: string;
	Description: string;
	Auth: string;
	HTTPS: boolean;
	Cors: string;
	Link: string;
	Category: string;
};
