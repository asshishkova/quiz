export const difficulties = {"easy": 1, "medium": 2, "hard": 3};
export const amountOfQuestions = 10;
export const secondsForAnswer = 30;
export const secondsBeforeHint = 5;
export const delayBetweenQuestions = 2000;

export function createArrayOfIndexes(array) {
  return [...Array(array.length).keys()];
}
