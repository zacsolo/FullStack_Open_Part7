import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Menu from './components/Menu.js';
import AnecdoteList from './components/AnecdoteList';
import About from './components/About';
import Footer from './components/Footer';
import CreateNew from './components/CreateNew';
import { Switch, Route } from 'react-router-dom';
import Anecdote from './components/Anecdote';

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1',
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2',
    },
  ]);

  const [notification, setNotification] = useState('');

  //--CREATING A NEW ANECDOTE, PASSED AS PROPS TO CREATENEW.js---
  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`A new Anecdote "${anecdote.content}" was created`);
    setTimeout(() => {
      setNotification('');
    }, 10000);
  };
  //---------------------------------------------------

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  //--VOTING NOT IN USE YET--
  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  //---------------------------------------------------

  //--USED TO PASS SINGLE ANECDOTE TO 'ANECDOTE' COMPONENT-----
  const match = useRouteMatch('/anecdotes/:id');
  const anecdoteAsProps = match
    ? anecdotes.find((a) => a.id === match.params.id)
    : null;

  //---------------------------------------------------

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification ? notification : null}
      <Switch>
        <Route path='/anecdotes/:id'>
          <Anecdote anecdote={anecdoteAsProps} />
        </Route>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='/create'>
          <CreateNew addNew={addNew} />
        </Route>
        <Route path='/'>
          <AnecdoteList anecdotes={anecdotes} />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
