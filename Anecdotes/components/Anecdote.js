import React from 'react';

const Anecdote = ({ anecdote }) => {
  return (
    <h4>
      "{anecdote.content}" by {anecdote.author}
    </h4>
  );
};

export default Anecdote;
