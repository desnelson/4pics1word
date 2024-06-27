import React, { useState, useEffect } from 'react';
import './App.css';

interface Props { }

const App: React.FC<Props> = () => {
  const [correct, setCorrect] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [word] = useState<string>('rats'); // correct word
  const [answer, setAnswer] = useState<string[]>(Array.from({ length: word.length }).map(() => ' _ '));
  const [letterBank, setLetterBank] = useState<string[]>([]);
  const [letterClickCounts, setLetterClickCounts] = useState<number[]>([]);

  useEffect(() => {
    const generateLetterBank = () => {
      let letters = word.split('');
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';

      while (letters.length < 10) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!letters.includes(randomLetter) && !word.includes(randomLetter)) {
          letters.push(randomLetter);
        }
      }

      setLetterBank(letters.sort(() => Math.random() - 0.5));
    };
    generateLetterBank();
  }, [word]);

  useEffect(() => {
    const initializeLetterClickCounts = () => {
      const letterCounts: number[] = [];
      letterBank.forEach((_, index) => letterCounts[index] = 0);
      setLetterClickCounts(letterCounts);
    };
    initializeLetterClickCounts();
  }, [letterBank]);

  const addToAnswer = (letter: string, index: number) => {
    const newAnswer = [...answer];
    let replaced = false;
    for (let i = 0; i < newAnswer.length; i++) {
      if (newAnswer[i] === ' _ ') {
        newAnswer[i] = letter;
        replaced = true;
        break;
      }
    }

    if (replaced) {
      setAnswer(newAnswer);
      setIncorrect(false);

      const updatedLetterClickCounts = [...letterClickCounts];
      updatedLetterClickCounts[index] += 1;
      setLetterClickCounts(updatedLetterClickCounts);
    }
  };

  const removeFromAnswer = (index: number) => {
    const letter = answer[index];
    const newAnswer = [...answer];
    newAnswer[index] = ' _ ';
    setAnswer(newAnswer);
    setIncorrect(false);

    const updatedLetterClickCounts = [...letterClickCounts];
    for (let i = 0; i < letterBank.length; i++) {
      if (letter === letterBank[i] && letterClickCounts[i] > 0) {
        updatedLetterClickCounts[i] -= 1;
        break;
      }
    }
    setLetterClickCounts(updatedLetterClickCounts);
  };

  const checkAnswer = () => {
    if (answer.join('').toLowerCase() === word.toLowerCase()) {
      setCorrect(true);
      setIncorrect(false);
    } else {
      setIncorrect(true);
    }
  };

  return (
    <div className="App">
      <div className="title">
        <h1>Puzzle Activity - <span>Guess the word that matches the four photos below.</span></h1>
      </div>
      <div className="image-container">
        {/* Add  images here */}
        <img src="data:image/jpeg;base64,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" />
        <img src="https://www.peta.org/wp-content/uploads/2015/04/10903825_872344489483233_7702124773103899276_o.jpg" />
        <img src="https://mymodernmet.com/wp/wp-content/uploads/2017/07/pet-rat-photography-diane-ozdamar-8.jpg" />
        <img src="https://www.treehugger.com/thmb/Se5V44Wpt4NMz3w2pIR6TCJhLhI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__mnn__images__2014__01__Blue-blanket-JF_0-5e09e9b9268f483fbd3f2da2d25418d3.jpg" />
      </div>
      {correct && <h2 className="check-message">Correct</h2>}
      {incorrect && <h2 className="check-message">Incorrect</h2>}
      <div className="answer">
        {answer.map((letter, index) => (
          <button key={index} className="answer-letter" onClick={() => removeFromAnswer(index)}>
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="letter-bank">
        {letterBank.map((letter, index) => (
          <button
            key={index}
            className={`letter ${letterClickCounts[index] > 0 ? 'disabled' : ''
              }`}
            onClick={() =>
              //letterClickCounts[letter] < word.split('').filter((l) => l === letter).length &&
              addToAnswer(letter, index)
            }
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="button-container"><button className="submit-button" onClick={checkAnswer}>Submit</button></div>
    </div>
  );
}

export default App;
