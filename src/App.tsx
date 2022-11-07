import { useState } from 'react';
import './App.css';
import Autocomplete from './components/atoms/Autocomplete/Autocomplete';
import PublicapisAutocomplete from './components/molecules/PublicapisAutocomplete/PublicapisAutocomplete';
import { PublicApisItem } from './models/PublicApisResponse';

const mockSuggestionsString = ["Ciao", "Hey come stai?", "Ciao come stai?", "Omar", "Paolo"]

const App = () => {
  const [selectedItem, setSelectedItem] = useState<PublicApisItem>()

  return (
    <div className="App">
      <div className="examples">
        <h1>Simple examples:</h1>
        <div className="grid">
          <Autocomplete label="Search input (Static)" suggestions={mockSuggestionsString} />
          <Autocomplete label="Disabled input (Static)" disabled suggestions={mockSuggestionsString} />
          <Autocomplete label="Error input (Static)" error="Incorrect entry." suggestions={mockSuggestionsString} />

          <PublicapisAutocomplete label="Search input" />
          <PublicapisAutocomplete label="Disabled input" disabled />
          <PublicapisAutocomplete label="Error input" error="Incorrect entry." />
        </div>

        <h1>Full functionality example:</h1>
        <PublicapisAutocomplete label="Search input" onObjectSelected={setSelectedItem} />
        {!!selectedItem ? (
          <>
            <p>Last selected item:</p>
            <pre>{JSON.stringify(selectedItem, null, "\t")}</pre>
          </>
        ) : (
          <p>No item selected</p>
        )}
      </div>
    </div>
  );
}

export default App;
