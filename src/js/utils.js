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
