
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useFiltersSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const products = useSelector(state => state.product.products);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(searchTerm);
        }, 500); 

        return () => clearTimeout(handler);
    }, [searchTerm]);

 
   


    const filteredProducts = useMemo(() => {
    
        if (!debouncedValue.trim()) {
            return []; 
          }
        const lowerSearch = debouncedValue.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowerSearch)
        );
    }, [debouncedValue, products]);

    return {
        searchTerm,
        setSearchTerm,
        filteredProducts
    };
};