import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCountry = (name) => {
  const URL = `https://restcountries.eu/rest/v2/name/${name}?fullText=true`;
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(URL);
        setCountry(...result.data);
        console.log('USE EFFECT SETTING DATA');
      } catch (err) {
        setCountry('NOT FOUND');
        console.log(err);
      }
    };
    fetchData();
  }, [URL]);

  return country;
};
