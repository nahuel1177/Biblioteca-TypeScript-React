import { TextField, Fab, Stack } from "@mui/material";
import { Search } from "@mui/icons-material";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export const SearchBar = ({ searchTerm, setSearchTerm, onSearch, placeholder = "Buscar..." }: SearchBarProps) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        size="small"
        placeholder={placeholder}
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Fab color="primary" onClick={onSearch} size="small">
        <Search />
      </Fab>
    </Stack>
  );
};