import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Key } from 'ts-key-enum'
import useForceRender from '../../../hooks/useForceRender'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import useVerticalKeyboardNavigation from '../../../hooks/useVerticalKeyboardNavigation/useVerticalKeyboardNavigation'
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
   const [selectedSuggestion, setSelectedSuggestion] = useState<T | null>(null)
   const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false)
   const [, forceRerender] = useForceRender()

   const rootRef = useRef<HTMLDivElement | null>(null)
   const inputRef = useRef<HTMLInputElement | null>(null)
   const dropdownRef = useRef<HTMLUListElement>(null)

   const keyboardVerticalNavigation = useVerticalKeyboardNavigation({
      topLimit: 0,
      bottomLimit: filteredSuggestions?.length - 1 ?? 0,
   })

   useOnClickOutside(dropdownRef, () => {
      setIsSuggestionMenuOpen(false)
   })

   useOnClickOutside(rootRef, () => {
      if (!!selectedSuggestion) {
         setInputRefValue(getSuggestionLabel!(selectedSuggestion), "restore")
         forceRerender()
      }
   })

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value
      setInputRefValue(inputValue, "change")

      suggestionsMenuHandle()
   };

   const handleInputKeyDown = (e: React.KeyboardEvent) => {
      const code = e.code


      if (code === Key.Enter) {
         selectSuggestion(filteredSuggestions[keyboardVerticalNavigation.index])
         return
      }

      const nextIndex = keyboardVerticalNavigation.handleKeyDown(code)
      if (nextIndex > -1) {
         e.preventDefault()

         code === Key.ArrowUp && onSuggestionArrowUp?.(filteredSuggestions[nextIndex])
         code === Key.ArrowDown && onSuggestionArrowDown?.(filteredSuggestions[nextIndex])
      }
   }

   const handleInputFocus = () => suggestionsMenuHandle()

   const handleSuggestionItemClick = (clickedSuggestion: T) => selectSuggestion(clickedSuggestion)

   const suggestionsMenuHandle = useCallback(() => {
      const inputValue = inputRef.current?.value ?? ''
      const minLengthSatisfied = inputValue.length >= minLength

      const filteredSuggestions = minLengthSatisfied
         ? suggestions.filter(suggestion => filterSuggestions!(inputValue, suggestion))
         : []

      setFilteredSuggestions(filteredSuggestions)
      setIsSuggestionMenuOpen(minLengthSatisfied)
      keyboardVerticalNavigation.resetIndex()
   }, [minLength, suggestions])

   const setInputRefValue = (value: string, changeType: ChangeType) => {
      if (inputRef.current) inputRef.current.value = value;
      onInputChange?.(value, changeType)
   }

   const selectSuggestion = (item: T) => {
      setSelectedSuggestion(item)
      setIsSuggestionMenuOpen(false)
      setInputRefValue(getSuggestionLabel!(item), "selected")
      keyboardVerticalNavigation.resetIndex()

      onObjectSelected?.(item)
   }

   getSuggestionLabel ??= (suggestion: T) => suggestion.toString()

   filterSuggestions ??= (inputValue: string, suggestion: T) => getSuggestionLabel!(suggestion).toLowerCase().includes(inputValue.toLowerCase())

   useEffect(() => suggestionsMenuHandle(), [suggestions, suggestionsMenuHandle])

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
                  const isActive = keyboardVerticalNavigation.index === i

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