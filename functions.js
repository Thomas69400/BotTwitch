export const convertWords = (words) => {
    words = words.filter(word => {if (word.length > 0) return word; });
    return words.reverse();
}
