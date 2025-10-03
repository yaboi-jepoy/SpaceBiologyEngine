// src/hooks/usePublications.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function usePublications(searchTerm = "") {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "publications"));
      let data = querySnapshot.docs.map(doc => doc.data());
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
    }
    fetchData();
  }, [searchTerm]);

  return { publications, loading };
}