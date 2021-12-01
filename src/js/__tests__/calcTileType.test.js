/* eslint-disable linebreak-style */
import {
  calcTileType,
} from '../utils';

test.each([
  [0, 'top-left'],
  [3, 'top'],
  [7, 'top-right'],
  [16, 'left'],
  [56, 'bottom-left'],
  [63, 'bottom-right'],
  [58, 'bottom'],
  [15, 'right'],
  [18, 'center'],
])(('теситрование функции выбора стилизации для клетки'), (index, positionCell) => {
  const boardSize = 8;
  const result = calcTileType(index, boardSize);
  expect(result).toEqual(positionCell);
});
