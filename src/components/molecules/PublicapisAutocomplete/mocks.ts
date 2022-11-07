import { PublicApisResponse } from '../../../models/PublicApisResponse';

export const mockedFetchSuccess: PublicApisResponse = {
	count: 3,
	entries: [
		{
			API: 'Edamam nutrition',
			Description: 'Nutrition Analysis',
			Auth: 'apiKey',
			HTTPS: true,
			Cors: 'unknown',
			Link: 'https://developer.edamam.com/edamam-docs-nutrition-api',
			Category: 'Food \u0026 Drink',
		},
		{
			API: 'Edamam recipes',
			Description: 'Recipe Search',
			Auth: 'apiKey',
			HTTPS: true,
			Cors: 'unknown',
			Link: 'https://developer.edamam.com/edamam-docs-recipe-api',
			Category: 'Food \u0026 Drink',
		},
		{
			API: 'Webdam',
			Description: 'Images',
			Auth: 'OAuth',
			HTTPS: true,
			Cors: 'unknown',
			Link: 'https://www.damsuccess.com/hc/en-us/articles/202134055-REST-API',
			Category: 'Photography',
		},
	],
};

export const mockedFetchEmpty = {
   count: 0,
   entries: null,
}