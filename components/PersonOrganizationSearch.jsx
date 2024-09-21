// components/PersonOrganizationSearch.jsx
import { useState, useEffect } from 'react';

export default function PersonOrganizationSearch({ onSelect, onAddNewOrganization }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsLoading(true);
      fetch(`/api/search?term=${searchTerm}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching suggestions:', err);
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSelect = (item) => {
    onSelect(item);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحث عن شخص أو جهة"
        className="w-full p-2 border rounded"
      />
      {isLoading && <p>جاري البحث...</p>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1">
          {suggestions.map((item, index) => (
            <li 
              key={index} 
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.name} - {item.type === 'person' ? item.title : 'جهة'}
            </li>
          ))}
        </ul>
      )}
      {searchTerm && suggestions.length === 0 && !isLoading && (
        <button 
          onClick={() => onAddNewOrganization(searchTerm)}
          className="mt-2 bg-blue-500 text-white p-2 rounded"
        >
          إضافة جهة جديدة: {searchTerm}
        </button>
      )}
    </div>
  );
}