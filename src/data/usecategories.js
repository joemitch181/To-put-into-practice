// src/data/useCategories.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error) setCategories(data);
      setLoading(false);
    }

    fetchCategories();
  }, []);

  return { categories, loading };
}
