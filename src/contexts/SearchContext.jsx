/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState("all");

  const clearSearch = () => {
    setSearchQuery("");
    setSearchScope("all");
  };

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      searchScope,
      setSearchScope,
      clearSearch,
    }),
    [searchQuery, searchScope]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
