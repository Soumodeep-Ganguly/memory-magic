import React, { useState, useEffect } from 'react';
import { colors } from './assets/colors';
import { getShuffledArray } from './utils/shuffler';
import { emojis } from './assets/emojis';
import Reload from './components/icons/reload';
import { CardProps } from './interfaces/card.type';
import { FlippedCardProps } from './interfaces/flipped-card.type';

const App: React.FC = () => {
  const [level, setLevel] = useState<number>(1);
  const [gridSize, setGridSize] = useState<number>(4);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [flippedCards, setFlippedCards] = useState<FlippedCardProps[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [points, setPoints] = useState<number>(100);
  const [levelClear, setLevelClear] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    generateCards();
  }, [level]);

  const generateCards = () => {
    const newColors = getShuffledArray(colors, ((gridSize * gridSize) / 2))
    const icons = getShuffledArray(emojis, ((gridSize * gridSize) / 2))
    const pairs: CardProps[] = [];

    for (let i = 0; i < (gridSize * gridSize) / 2; i++) {
      const card = { color: newColors[i % newColors.length], icon: icons[i % icons.length] };
      pairs.push(card, { ...card });
    }

    const shuffledPairs = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffledPairs);
    setMatchedCards([]);
    setFlippedCards([]);
    setLevelClear(false);
    setTimeout(() => setShow(false), level * 1000)
  };

  const handleCardClick = (card: CardProps, index: number) => {
    if (flippedCards.length < 2 && !flippedCards.some((flipped) => flipped.index === index) && !matchedCards.includes(index)) {
      const newFlippedCards = [...flippedCards, { card, index }];
      setFlippedCards(newFlippedCards);

      if (newFlippedCards.length === 2) {
        setTimeout(() => {
          checkMatch(newFlippedCards);
        }, 1000);
      }
    }
  };

  const checkMatch = (flippedCards: FlippedCardProps[]) => {
    const [first, second] = flippedCards;
    if (first.card.color === second.card.color && first.card.icon === second.card.icon) {
      setMatchedCards((prev) => [...prev, first.index, second.index]);
      setPoints((prev) => prev + 10);
      setFlippedCards([]);
      if (matchedCards.length + 2 === gridSize * gridSize) {
        setLevelClear(true);
      }
    } else {
      setPoints((prev) => prev - 10);
      setFlippedCards([]);
    }
  };

  const handleNextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);

    if (newLevel === 2) setGridSize(6);
    else if (newLevel === 3) setGridSize(8);
    else if (newLevel === 4) setGridSize(10);
    else setGridSize(4);
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-5 relative">
      <h1 className="text-2xl font-bold mb-4 text-center">Memory Match Game</h1>
      <div className='flex justify-between mb-2'>
        <div className="text-lg font-bold">Level {level}</div>
        <div className="text-lg font-bold mr-3">Points: {points}</div>
      </div>
      <div className={`grid`} style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`, gap: `calc(2rem / ${gridSize})`, width: '65vh', height: '65vh' }}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-gray-200 border border-gray-400 rounded-lg cursor-pointer`}
            style={{
              backgroundColor: (show || flippedCards.some((flippedCard) => flippedCard.index === index) || matchedCards.includes(index))
                ? card.color
                : '',
              width: `calc((70vh - ${(gridSize - 1) * 0.8}rem) / ${gridSize})`,
              height: `calc((70vh - ${(gridSize - 1) * 0.8}rem) / ${gridSize})`,
            }}
            onClick={() => handleCardClick(card, index)}
          >
            <span
              style={{
                fontSize: `calc(10rem / ${gridSize})`,
                lineHeight: '1',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%', 
                width: '100%', 
              }}
            >
              {(show || flippedCards.some((flippedCard) => flippedCard.index === index) || matchedCards.includes(index)) ? card.icon : ''}
            </span>
          </div>
        ))}
      </div>
      {levelClear && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Level Clear!</h2>
            <div className='flex'>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-lg flex"
                onClick={generateCards}
              >
                <Reload className='size-5 mr-1 mt-1' /> Play Again
              </button>
              <button
                className="px-4 py-2 ml-3 bg-blue-500 text-white rounded-lg text-lg"
                onClick={handleNextLevel}
              >
                Next Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;