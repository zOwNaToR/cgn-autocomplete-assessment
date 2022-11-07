import React, { useState } from 'react'
import useQuery from '../../../hooks/useQuery'
import { PublicApisItem, PublicApisResponse } from '../../../models/PublicApisResponse'
import { fetchApis } from '../../../services/publicApisService'
import Autocomplete from '../../atoms/Autocomplete/Autocomplete'

const minInputLength = 3

type PublicapisAutocompleteProps = Omit<
   React.ComponentProps<typeof Autocomplete<PublicApisItem>>,
   'suggestions' | 'minLength' | 'getSuggestionLabel' | 'filterSuggestions'
>

const PublicapisAutocomplete = (props: PublicapisAutocompleteProps) => {
   const [inputValue, setInputValue] = useState('')

   const { data, isLoading } = useQuery<PublicApisResponse>({
      key: `getApis/${inputValue}`,
      queryFn: (signal) => fetchApis(inputValue, signal),
      enabled: inputValue.length >= minInputLength,
   })

   const suggestions = (isLoading || !data || !data.entries) ? [] : data.entries
   const error = !isLoading && inputValue.length >= minInputLength && !suggestions.length ? "Incorrect entry." : ""

   return (
      <Autocomplete<PublicApisItem>
         {...props}
         suggestions={suggestions}
         minLength={minInputLength}
         error={error}
         filterSuggestions={() => true}
         getSuggestionLabel={item => item.Description}
         onInputChange={(value, changeType) => {
            if (changeType === "change") setInputValue(value)
         }}
      />
   )
}

export default PublicapisAutocomplete