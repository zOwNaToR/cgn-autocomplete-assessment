import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Key } from 'ts-key-enum'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { cx } from '../../../utils/stringUtils'
import TextField from '../TextField/TextField'
import './styles.css'

export type SuggestionType = string | Record<string, any>
type ChangeType = "restore" | "change" | "selected"

type AutocompleteProps<T extends SuggestionType> = React.ComponentProps<typeof TextField> & {
   suggestions: T[]
   minLength?: number
   error?: string
   isLoading?: boolean
   getSuggestionLabel?: (suggestion: T) => string
   filterSuggestions?: (inputValue: string, suggestion: T) => boolean
   onObjectSelected?: (suggestion: T) => void
   onSuggestionArrowDown?: (suggestion: T) => void
   onSuggestionArrowUp?: (suggestion: T) => void
   onInputChange?: (value: string, changeType: ChangeType) => void
}

const AutocompleteInner = <T extends SuggestionType>({
   suggestions,
   minLength = 3,
   error,
   isLoading = false,
   getSuggestionLabel,
   filterSuggestions,
   onObjectSelected,
   onSuggestionArrowDown,
   onSuggestionArrowUp,
   onInputChange,
   ...textFieldProps
}: AutocompleteProps<T>, ref: React.ForwardedRef<HTMLInputElement>) => {
   const [filteredSuggestions, setFilteredSuggestions] = useState<T[]>([])
   const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(-1)
   const [selectedSuggestion, setSelectedSuggestion] = useState<T | null>(null)
   const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false)

   const rootRef = useRef<HTMLDivElement | null>(null)
   const inputRef = useRef<HTMLInputElement | null>(null)
   const dropdownRef = useRef<HTMLUListElement>(null)

   useOnClickOutside(dropdownRef, () => {
      setIsSuggestionMenuOpen(false)
   })
   
   useOnClickOutside(rootRef, () => {
      if (!!selectedSuggestion) setInputRefValue(getSuggestionLabel!(selectedSuggestion), "restore")
   })

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value
      setInputRefValue(inputValue, "change")

      suggestionsMenuHandle()
   };

   const handleInputKeyDown = (e: React.KeyboardEvent) => {
      if (e.code === Key.Enter) {
         selectItem(filteredSuggestions[highlightedSuggestionIndex])
         return
      }

      const upperLimitReached = highlightedSuggestionIndex <= 0
      const lowerLimitReached = highlightedSuggestionIndex + 1 === filteredSuggestions.length

      if (e.code === Key.ArrowUp) {
         e.preventDefault()
         if (upperLimitReached) return

         const nextIndex = highlightedSuggestionIndex - 1

         setHighlightedSuggestionIndex(nextIndex)
         onSuggestionArrowUp?.(filteredSuggestions[nextIndex])
         return
      }

      if (e.code === Key.ArrowDown) {
         e.preventDefault()
         if (lowerLimitReached) return

         const nextIndex = highlightedSuggestionIndex + 1

         setHighlightedSuggestionIndex(nextIndex)
         onSuggestionArrowDown?.(filteredSuggestions[nextIndex])
         return
      }
   }

   const handleInputFocus = () => suggestionsMenuHandle()

   const handleSuggestionItemClick = (clickedSuggestion: T) => selectItem(clickedSuggestion)

   const suggestionsMenuHandle = useCallback(() => {
      const inputValue = inputRef.current?.value ?? ''
      const minLengthSatisfied = inputValue.length >= minLength

      const filteredSuggestions = minLengthSatisfied
         ? suggestions.filter(suggestion => filterSuggestions!(inputValue, suggestion))
         : []

      setHighlightedSuggestionIndex(-1)
      setFilteredSuggestions(filteredSuggestions)
      setIsSuggestionMenuOpen(minLengthSatisfied)
   }, [minLength, suggestions])

   const setInputRefValue = (value: string, changeType: ChangeType) => {
      if (inputRef.current) inputRef.current.value = value;
      onInputChange?.(value, changeType)
   }

   const selectItem = (item: T) => {
      setSelectedSuggestion(item)
      setIsSuggestionMenuOpen(false)
      setHighlightedSuggestionIndex(-1)
      setInputRefValue(getSuggestionLabel!(item), "selected")

      onObjectSelected?.(item)
   }

   getSuggestionLabel ??= (suggestion: T) => suggestion.toString()

   filterSuggestions ??= (inputValue: string, suggestion: T) => getSuggestionLabel!(suggestion).toLowerCase().includes(inputValue.toLowerCase())

   useEffect(() => {
      suggestionsMenuHandle()
   }, [suggestions, suggestionsMenuHandle])

   const shouldSeeSuggestions = !isLoading && isSuggestionMenuOpen && !!filteredSuggestions.length

   return (
      <div className="autocomplete-root" ref={rootRef}>
         <TextField
            ref={(node) => {
               inputRef.current = node;

               if (typeof ref === 'function') {
                  ref(node);
               } else if (ref) {
                  ref.current = node;
               }
            }}
            error={error}
            {...textFieldProps}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
         />

         {shouldSeeSuggestions && (
            <ul ref={dropdownRef} className="suggestions-menu" data-testid="suggestions-menu">
               {filteredSuggestions.map((suggestion, i) => {
                  const label = getSuggestionLabel!(suggestion)
                  const isSelected = suggestion === selectedSuggestion
                  const isActive = highlightedSuggestionIndex === i

                  return (
                     <li
                        key={label}
                        data-testid="suggestions-items"
                        className={cx('suggestions-item', { "active": isActive, "selected": isSelected })}
                        onClick={() => handleSuggestionItemClick(suggestion)}
                     >
                        {label}
                     </li>
                  )
               }
               )}
            </ul>
         )}

      </div>
   )
}

const Autocomplete = React.forwardRef(AutocompleteInner) as <T extends SuggestionType>(
   props: AutocompleteProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof AutocompleteInner>;

export default Autocomplete