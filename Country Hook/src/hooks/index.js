import { useState } from 'react';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

// export const useCountry = (name) => {
//   const URL = `https://restcountries.eu/rest/v2/name/${name}?fullText=true`;
//   const [country, setCountry] = useState(null);
//   console.log('USE COUNTRY BEING CALLED');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await axios.get(URL);
//         setCountry(...result.data);
//         console.log('USE EFFECT SETTING DATA');
//       } catch (err) {
//         setCountry('NOT FOUND');
//         console.log(err);
//       }
//     };
//     fetchData();
//   }, [URL]);

//   return country;
// };
