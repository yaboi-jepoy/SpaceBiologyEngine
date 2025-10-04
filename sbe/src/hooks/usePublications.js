// src/hooks/usePublications.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function usePublications(searchTerm = "") {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log('🔄 Starting to fetch publications...');
      setLoading(true);
      
      try {
        const querySnapshot = await getDocs(collection(db, "publications"));
        console.log('✅ Firestore query success! Documents:', querySnapshot.size);
        
        let data = querySnapshot.docs.map(doc => doc.data());
        console.log('📊 Publications fetched:', data.length);
        
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          data = data.filter(
            pub =>
              pub.Title.toLowerCase().includes(term) ||
              pub.Link.toLowerCase().includes(term)
          );
        }
        
        setPublications(data);
        setLoading(false);
        console.log('✅ Publications loaded successfully!');
      } catch (error) {
        console.error('❌ Error fetching publications:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, [searchTerm]);

  return { publications, loading };
}