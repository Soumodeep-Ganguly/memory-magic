const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const getShuffledArray = (array: string[], count: number) => {
    const shuffledColors = shuffleArray([...array]);
    return shuffledColors.slice(0, count);
};