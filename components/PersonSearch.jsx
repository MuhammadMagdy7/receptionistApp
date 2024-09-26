// components/PersonSearch.jsx
import { useState, useEffect } from 'react';

export default function PersonSearch({ onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsLoading(true);
      fetch(`/api/search/people?term=${searchTerm}`)
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

  const handleSelect = (person) => {
    onSelect(person);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ابحث عن شخص (الاسم، الصفة، أو الجهة)"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-50"
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
          {suggestions.map((person, index) => (
            <li 
              key={index} 
              onClick={() => handleSelect(person)}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <div className="font-semibold">{person.name}</div>
              <div className="text-sm text-gray-600">{person.title}</div>
              <div className="text-sm text-gray-500">{person.organization.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}