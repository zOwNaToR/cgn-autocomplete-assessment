export type SuggestionType = string | Record<string, any>;

export enum SuggestionActionKind {
	SELECT_SUGGESTION = 'SELECT_SUGGESTION',
	SET_FILTERED_SUGGESTIONS = 'SET_FILTERED_SUGGESTIONS',
	CLOSE_MENU = 'CLOSE_MENU',
}

type SuggestionAction<T extends SuggestionType> =
	| { type: SuggestionActionKind.SELECT_SUGGESTION; payload: T }
	| { type: SuggestionActionKind.CLOSE_MENU }
	| {
			type: SuggestionActionKind.SET_FILTERED_SUGGESTIONS;
			payload: {
				suggestions: T[];
				filterSuggestions: (inputValue: string, suggestion: T) => boolean;
				inputValue: string;
				minLength: number;
			};
	  };

interface SuggestionState<T extends SuggestionType> {
	filteredSuggestions: T[];
	selectedSuggestion: T | null;
	isMenuOpen: boolean;
}

export const createSuggestionsReducer =
	<T extends SuggestionType>() =>
	(state: SuggestionState<T>, action: SuggestionAction<T>): SuggestionState<T> => {
		switch (action.type) {
			case SuggestionActionKind.SELECT_SUGGESTION:
				return {
					...state,
					isMenuOpen: false,
					selectedSuggestion: action.payload,
				};
			case SuggestionActionKind.CLOSE_MENU:
				return {
					...state,
					isMenuOpen: false,
				};
			case SuggestionActionKind.SET_FILTERED_SUGGESTIONS:
				const {
					payload: { suggestions, filterSuggestions, inputValue, minLength },
				} = action;

				const minLengthSatisfied = inputValue.length >= minLength;
				const nextFilteredSuggestions = minLengthSatisfied
					? suggestions.filter((suggestion) => filterSuggestions!(inputValue, suggestion))
					: [];

				return {
					...state,
					isMenuOpen: !!nextFilteredSuggestions.length,
					filteredSuggestions: nextFilteredSuggestions,
				};
			default:
				return state;
		}
	};
