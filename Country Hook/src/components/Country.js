import React from 'react';

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (country === 'NOT FOUND') {
    return <div>not found...</div>;
  }

  const { name, capital, population, flag } = country;

  return (
    <div>
      <h3>{name} </h3>
      <div>capital {capital} </div>
      <div>population {population}</div>
      <img src={flag} height='100' alt={`flag of ${name}`} />
    </div>
  );
};

export default Country;
