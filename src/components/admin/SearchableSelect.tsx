import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    description?: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select option...",
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-2">{label}</label>}

            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl flex items-center justify-between transition-all text-left ${isOpen ? 'border-primary ring-4 ring-primary/10' : 'border-gray-200'
                    }`}
            >
                <div className="flex-1 min-w-0">
                    {selectedOption ? (
                        <div>
                            <span className="block font-black text-gray-800 truncate">{selectedOption.label}</span>
                            {selectedOption.description && (
                                <span className="block text-xs text-gray-400 truncate mt-0.5">{selectedOption.description}</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-400 font-bold">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={20} className={`text-gray-400 ml-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[50] animate-in fade-in slide-in-from-top-2">
                    {/* Search Input */}
                    <div className="p-4 border-b border-gray-50 flex items-center gap-2 sticky top-0 bg-white z-10">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none font-bold text-gray-700 placeholder:text-gray-300 text-sm"
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearchQuery('');
                                    }}
                                    className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-colors ${option.value === value
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${option.value === value ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                        }`}>
                                        {option.value === value && <Check size={12} className="text-white" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{option.label}</p>
                                        {option.description && (
                                            <p className="text-xs opacity-70 truncate">{option.description}</p>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-400 text-sm font-medium">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
