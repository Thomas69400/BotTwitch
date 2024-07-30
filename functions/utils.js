export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

export const checkRole = (tags) => {
  if (tags['badges']['broadcaster'] == 1) return 2;
  else if (tags['mod'] === true) return 1;
  else return 0;
};
