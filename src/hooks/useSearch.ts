import { useState, useMemo } from 'react';

export const useSearch = <T>(
  data: T[],
  searchFields: (keyof T | ((item: T) => string))[],
  initialQuery: string = ''
) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    
    return data.filter((item) => {
      return searchFields.some((field) => {
        let value: string;
        
        if (typeof field === 'function') {
          value = field(item);
        } else {
          const fieldValue = item[field];
          if (typeof fieldValue === 'string') {
            value = fieldValue;
          } else if (typeof fieldValue === 'number') {
            value = fieldValue.toString();
          } else if (fieldValue && typeof fieldValue === 'object') {
            value = JSON.stringify(fieldValue);
          } else {
            value = String(fieldValue || '');
          }
        }
        
        return value.toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields]);

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
  };
};