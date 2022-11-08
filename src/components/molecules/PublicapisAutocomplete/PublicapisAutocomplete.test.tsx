import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { PublicApisResponse } from '../../../models/PublicApisResponse';
import { mockedFetchEmpty, mockedFetchSuccess } from './mocks';
import PublicapisAutocomplete from './PublicapisAutocomplete';

describe('PublicapisAutocomplete', () => {
	const defaultLabel = 'My autocomplete';

	const setup = ({
		label,
		...props
	}: Partial<React.ComponentProps<typeof PublicapisAutocomplete>> = {}) => {
		const labelText = label ?? defaultLabel;

		const autocomplete = render(<PublicapisAutocomplete
			label={labelText}
			{...props}
		/>);

		const input = autocomplete.queryByLabelText(labelText)!;
		const labelElement = autocomplete.queryByText(labelText)!;
		const getSuggestionsMenu = () => autocomplete.queryByTestId('suggestions-menu')!;
		const getSuggestionsItems = () => autocomplete.queryAllByTestId('suggestions-items')!;
		const getError = () => autocomplete.queryByText('Incorrect entry.');

		return {
			autocomplete,
			input,
			label: labelElement,
			getSuggestionsMenu,
			getSuggestionsItems,
			getError,
		};
	};

	const mockFetch = (result: PublicApisResponse) => {
		const spy = jest.spyOn(global, "fetch")

		spy.mockImplementation(
			jest.fn(() => Promise.resolve({ json: () => Promise.resolve(result), })) as jest.Mock
		)

		return spy
	}

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders an input with label', () => {
		const { input, label } = setup();

		expect(input).toBeInTheDocument();
		expect(label).toBeInTheDocument();
	});

	describe('check input length before open fetch server', () => {
		it("should not fetch server when input length is less than 3", async () => {
			const spy = mockFetch(mockedFetchSuccess)
			const { input } = setup()

			act(() => userEvent.type(input, 'Da'))

			await waitFor(() => {
				expect(spy).not.toHaveBeenCalled();
			})
		});

		it("should fetch server and open menu when input length is greater or equal 3", async () => {
			const spy = mockFetch(mockedFetchSuccess)
			const { input, getSuggestionsMenu } = setup()

			act(() => userEvent.type(input, 'Dam'))

			await waitFor(() => {
				expect(getSuggestionsMenu()).toBeInTheDocument();
				expect(spy).toHaveBeenCalledTimes(1);
			})
		});
	});

	describe('suggestions fetch', () => {
		it("should render suggestion items with same text to fetched suggestions", async () => {
			mockFetch(mockedFetchSuccess)
			const { input, getSuggestionsItems } = setup()

			act(() => userEvent.type(input, 'Dam'))

			await waitFor(() => {
				expect(getSuggestionsItems()).toHaveLength(mockedFetchSuccess.entries!.length)
				expect(getSuggestionsItems().map(x => x.textContent)).toEqual(mockedFetchSuccess.entries!.map(x => x.Description));
			})
		});

		it("shows error when input length is satisfied but no suggestion is found", async () => {
			mockFetch(mockedFetchEmpty)
			const { input, getSuggestionsMenu, getError } = setup()

			act(() => userEvent.paste(input, 'Ciao'))

			await waitFor(() => {
				expect(getSuggestionsMenu()).not.toBeInTheDocument();
				expect(getError()).toBeInTheDocument();
			})
		});
	});
});
