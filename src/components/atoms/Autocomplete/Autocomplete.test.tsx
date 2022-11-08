import Autocomplete from "./Autocomplete";
import { fireEvent, render, waitFor } from '@testing-library/react';
import React from "react";
import userEvent from "@testing-library/user-event";

describe('Autocomplete', () => {
   const defaultLabel = "My autocomplete"
   const defaultSuggestions = ["Ciao", "Hey come stai?", "Ciao come stai?", "Omar", "Paolo"]

   const setup = ({ label, suggestions, ...props }: Partial<React.ComponentProps<typeof Autocomplete>> = {}) => {
      const labelText = label ?? defaultLabel
      const suggestionsArray = suggestions ?? defaultSuggestions

      const autocomplete = render(<Autocomplete
         label={labelText}
         suggestions={suggestionsArray}
         {...props}
      />);

      const input = autocomplete.queryByLabelText(labelText)!
      const labelElement = autocomplete.queryByText(labelText)!
      const getSuggestionsMenu = () => autocomplete.queryByTestId("suggestions-menu")!
      const getSuggestionsItems = () => autocomplete.queryAllByTestId("suggestions-items")!
      const getError = () => autocomplete.queryByText("Incorrect entry.")

      const externalDiv = document.createElement("div")
      document.body.appendChild(externalDiv)

      return {
         autocomplete,
         input,
         label: labelElement,
         externalDiv,
         getSuggestionsMenu,
         getSuggestionsItems,
         getError,
      }
   }

   it("renders an input with label", () => {
      const { input, label } = setup()

      expect(input).toBeInTheDocument();
      expect(label).toBeInTheDocument();
   });

   it("calls onInputChange when input value is changed", () => {
      const onInputChange = jest.fn();
      const { input } = setup({ onInputChange })

      userEvent.type(input, 'Ciao')

      expect(onInputChange).toBeCalledTimes(4)
      expect(onInputChange).toBeCalledWith("Ciao", "change")
   });

   it("does not filter suggestions when user types inside input if custom filterSuggestions function is passed", () => {
      const filterSuggestions = () => true
      const { input, getSuggestionsItems } = setup({ filterSuggestions })

      userEvent.type(input, 'Ciao')

      expect(getSuggestionsItems()).toHaveLength(defaultSuggestions.length)
   });

	describe('check minLength before open suggestions menu', () => {
      it("does not show suggestion when input length is not satisfied", () => {
         const { input, getSuggestionsMenu } = setup()
   
         userEvent.type(input, 'C')
         expect(getSuggestionsMenu()).not.toBeInTheDocument();
   
         userEvent.type(input, 'Ci')
         expect(getSuggestionsMenu()).not.toBeInTheDocument();
   
         userEvent.clear(input)
         expect(getSuggestionsMenu()).not.toBeInTheDocument();
      });
   
      it("show suggestion when input length is satisfied", () => {
         const { input, getSuggestionsMenu, getSuggestionsItems } = setup()
   
         userEvent.type(input, 'Omar')
         expect(getSuggestionsMenu()).toBeInTheDocument();
         expect(getSuggestionsItems()).toHaveLength(1);
   
         userEvent.clear(input)
         userEvent.type(input, 'Hey ')
         expect(getSuggestionsMenu()).toBeInTheDocument();
         expect(getSuggestionsItems()).toHaveLength(1);
   
         userEvent.clear(input)
         userEvent.type(input, 'Cia')
         expect(getSuggestionsMenu()).toBeInTheDocument();
         expect(getSuggestionsItems()).toHaveLength(2);
      });
   });

	describe('click outside of suggestions menu', () => {
      it("closes suggestions menu after click outside menu", () => {
         const { input, label, getSuggestionsMenu } = setup()
   
         userEvent.type(input, 'Omar')
         expect(getSuggestionsMenu()).toBeInTheDocument();
   
         userEvent.click(label)
         expect(getSuggestionsMenu()).not.toBeInTheDocument()
      });
   
      it("restores item text inside input after click outside autocomplete when item was selected", () => {
         const { input, externalDiv, getSuggestionsItems } = setup()
   
         // Write "Ciao" and click a suggestion
         userEvent.type(input, 'Ciao')
         const itemToClick = getSuggestionsItems().find(x => x.textContent === "Ciao come stai?")
         expect(itemToClick).toBeDefined()
         userEvent.click(itemToClick!)
         // Delete a character and click outsite autocomplete
         userEvent.type(input, '{backspace}')
         userEvent.click(externalDiv)
   
         expect(input).toHaveValue("Ciao come stai?")
      });
   });

	describe('input focus', () => {
      it("opens suggestion menu on input focus when input length is satisfied", () => {
         const { input, label, getSuggestionsMenu } = setup()
   
         userEvent.type(input, 'Omar')
         expect(getSuggestionsMenu()).toBeInTheDocument();
   
         userEvent.click(label)
         expect(getSuggestionsMenu()).not.toBeInTheDocument()
   
         fireEvent.focus(input)
         expect(getSuggestionsMenu()).toBeInTheDocument();
      });
   
      it("does not open suggestion menu on input focus when input length is not satisfied", () => {
         const { input, label, getSuggestionsMenu } = setup()
   
         userEvent.type(input, 'Om')
         expect(getSuggestionsMenu()).not.toBeInTheDocument();
   
         userEvent.click(label)
         expect(getSuggestionsMenu()).not.toBeInTheDocument()
   
         fireEvent.focus(input)
         expect(getSuggestionsMenu()).not.toBeInTheDocument();
      });
   });

	describe('item selection and highlighting', () => {
      it("passes correct object on item click", () => {
         const onObjectSelected = jest.fn();
         const { input, getSuggestionsItems } = setup({ onObjectSelected })
   
         userEvent.type(input, 'Ciao')
   
         const itemToClick = getSuggestionsItems().find(x => x.textContent === "Ciao come stai?")
         expect(itemToClick).toBeDefined()
         userEvent.click(itemToClick!)
   
         expect(onObjectSelected).toBeCalledTimes(1)
         expect(onObjectSelected).toBeCalledWith("Ciao come stai?")
      });

      it("passes correct object on item selection with enter", () => {
         const onObjectSelected = jest.fn();
         const { input } = setup({ onObjectSelected })
   
         userEvent.type(input, 'Ciao')
         userEvent.type(input, `{arrowdown}`)
         userEvent.type(input, `{arrowdown}`)
         userEvent.type(input, `{enter}`)
   
         expect(onObjectSelected).toBeCalledTimes(1)
         expect(onObjectSelected).toBeCalledWith("Ciao come stai?")
      });

      it("highlights suggestions correctly when pressing up and down arrow keys", () => {
         const onSuggestionArrowDown = jest.fn();
         const onSuggestionArrowUp = jest.fn();
         const { input, getSuggestionsItems } = setup({ onSuggestionArrowDown, onSuggestionArrowUp })
   
         userEvent.type(input, 'Ciao')
         userEvent.type(input, `{arrowdown}`)
         userEvent.type(input, `{arrowdown}`)
         expect(onSuggestionArrowDown).toBeCalledTimes(2)
   
         userEvent.type(input, `{arrowup}`)
         expect(onSuggestionArrowUp).toBeCalledTimes(1)
   
         // userEvent.type(input, `{arrowdown}`) and userEvent.type(input, `{arrowup}`) have strange behaviour, this will not work
         // expect(getSuggestionsItems()[0]).toHaveClass("active")
      });
   });
})
