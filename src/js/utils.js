/* eslint-disable linebreak-style */
export function calcTileType(index, boardSize) {
  // TODO: write logic here
  const rightPosition = [];
  for (let i = 0; i < boardSize; i += 1) {
    rightPosition.push(i * boardSize - 1);
  }
  let cellPosition = '';
  if (index === 0) {
    cellPosition = 'top-left';
  } else if (index > 0 && index < (boardSize - 1)) {
    cellPosition = 'top';
  } else if (index + 1 === boardSize) {
    cellPosition = 'top-right';
  } else if (!(index % boardSize) && index !== (boardSize * (boardSize - 1))) {
    cellPosition = 'left';
  } else if (index === (boardSize * (boardSize - 1))) {
    cellPosition = 'bottom-left';
  } else if (index > (boardSize * (boardSize - 1)) && index < (boardSize * boardSize - 1)) {
    cellPosition = 'bottom';
  } else if (index === boardSize ** 2 - 1) {
    cellPosition = 'bottom-right';
  } else if (rightPosition.includes(index)) {
    cellPosition = 'right';
  } else {
    cellPosition = 'center';
  }
  return cellPosition;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcDist(charDist, boardSize, activeCharPosition) {
  const arrDist = [];
  const positionRow = Math.floor(activeCharPosition / boardSize);
  const positionColumn = activeCharPosition % boardSize;
  for (let i = 1; i <= charDist; i += 1) {
    if (positionColumn + i < boardSize) {
      arrDist.push(positionRow * boardSize + (positionColumn + i));
    }
    if (positionColumn - i >= 0) {
      arrDist.push(positionRow * boardSize + (positionColumn - i));
    }
  }
  arrDist.push(activeCharPosition);
  arrDist.forEach((item) => {
    for (let n = (item - (charDist * boardSize)); n <= (item + (charDist * boardSize)); n += 8) {
      if (n >= 0 && n < 64 && n !== activeCharPosition) {
        arrDist.push(n);
      }
    }
  });
  const unique = [...new Set(arrDist)];
  const indexDel = unique.indexOf(activeCharPosition);
  if (indexDel > -1) {
    unique.splice(indexDel, 1);
  }
  return unique;
}
