import { getSudoku } from 'sudoku-gen';

export class SudokuFactory {
  constructor() {};
  make() {
    const john = getSudoku().solution.split('');
    return [
      [john[0], john[1], john[2], john[9], john[10], john[11], john[18], john[19], john[20]],
      [john[3], john[4], john[5], john[12], john[13], john[14], john[21], john[22], john[23]],
      [john[6], john[7], john[8], john[15], john[16], john[17], john[24], john[25], john[26]],
      [john[27], john[28], john[29], john[36], john[37], john[38], john[45], john[46], john[47]],
      [john[30], john[31], john[32], john[39], john[40], john[41], john[48], john[49], john[50]],
      [john[33], john[34], john[35], john[42], john[43], john[44], john[51], john[52], john[53]],
      [john[54], john[55], john[56], john[63], john[64], john[65], john[72], john[73], john[74]],
      [john[57], john[58], john[59], john[66], john[67], john[68], john[75], john[76], john[77]],
      [john[60], john[61], john[62], john[69], john[70], john[71], john[78], john[79], john[80]]
    ];
  };
};