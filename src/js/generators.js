/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const RandomClass = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  const characterRandom = new RandomClass();
  characterRandom.level = Math.floor(1 + Math.random() * maxLevel);
  yield characterRandom;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const arrTeam = [];
  for (let i = 0; i < characterCount; i += 1) {
    arrTeam.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return arrTeam;
}

export function* positionGenerator(startLine, bordsize) {
  const fullField = [...new Array(bordsize ** 2).keys()];
  const lineHero = fullField.filter((item) => startLine.includes(item % bordsize));
  // Тосование Фишера-Йетса ниже:
  for (let i = lineHero.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [lineHero[i], lineHero[j]] = [lineHero[j], lineHero[i]];
  }
  for (const item of lineHero) {
    yield item;
  }
}
