// Compact zero-dependency ISO/IEC 18004 QR Code matrix generator (Byte mode, ECC Level L, Versions 1-6).

const V_PARAMS: ReadonlyArray<readonly [size: number, totalCodewords: number, ecCodewords: number, align: readonly number[]]> = [
  [21, 26, 7, []],
  [25, 44, 10, [6, 18]],
  [29, 70, 15, [6, 22]],
  [33, 100, 20, [6, 26]],
  [37, 134, 26, [6, 30]],
  [41, 172, 18, [6, 34]], // V6-L has 2 blocks of (68 data + 18 ec); V1-V5 use 1 block (up to 106 bytes)
];

function gfMul(a: number, b: number): number {
  let res = 0;
  let x = a;
  let y = b;
  while (y > 0) {
    if (y & 1) res ^= x;
    x = (x << 1) ^ (x & 0x80 ? 0x11d : 0);
    y >>= 1;
  }
  return res;
}

function rsRemainder(data: number[], ecLen: number): number[] {
  let gen = [1];
  let root = 1;
  for (let i = 0; i < ecLen; i++) {
    const next = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j];
      next[j + 1] ^= gfMul(gen[j], root);
    }
    gen = next;
    root = gfMul(root, 2);
  }
  const rem = new Array(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ rem[0];
    rem.shift();
    rem.push(0);
    for (let j = 0; j < ecLen; j++) {
      rem[j] ^= gfMul(gen[j + 1], factor);
    }
  }
  return rem;
}

function formatBits(ecIndicator: number, mask: number): number {
  const data = (ecIndicator << 3) | mask;
  let rem = data << 10;
  for (let i = 14; i >= 10; i--) {
    if ((rem >> i) & 1) rem ^= 0x537 << (i - 10);
  }
  return ((data << 10) | rem) ^ 0x5412;
}

export function createQrMatrix(text: string): boolean[][] {
  const bytes = Array.from(new TextEncoder().encode(text)).slice(0, 104);
  let vIdx = 0;
  while (vIdx < 4 && bytes.length + 2 > V_PARAMS[vIdx][1] - V_PARAMS[vIdx][2]) {
    vIdx++;
  }
  const [size, totalCw, ecCw, align] = V_PARAMS[vIdx];
  const dataCwCount = totalCw - ecCw;

  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  pushBits(0b0100, 4); // Byte mode
  pushBits(bytes.length, 8);
  for (const b of bytes) pushBits(b, 8);
  pushBits(0, Math.min(4, dataCwCount * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const dataCw: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    dataCw.push(byte);
  }
  const pads = [0xec, 0x11];
  let padIdx = 0;
  while (dataCw.length < dataCwCount) {
    dataCw.push(pads[padIdx++ % 2]);
  }

  const allCw = [...dataCw, ...rsRemainder(dataCw, ecCw)];
  const stream: number[] = [];
  for (const cw of allCw) pushBitsTo(stream, cw, 8);

  const modules: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunc: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  const setFunc = (r: number, c: number, dark: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = dark;
      isFunc[r][c] = true;
    }
  };

  const drawFinder = (r0: number, c0: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const dist = Math.max(Math.abs(dr - 3), Math.abs(dc - 3));
        setFunc(r0 + dr, c0 + dc, dist !== 2 && dist !== 4);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  for (const r of align) {
    for (const c of align) {
      if ((r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          setFunc(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
        }
      }
    }
  }

  // Reserve format info areas & dark module
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      isFunc[8][i] = true;
      isFunc[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    isFunc[8][size - 1 - i] = true;
    isFunc[size - 1 - i][8] = true;
  }
  setFunc(size - 8, 8, true);

  // Place data bits in upward/downward 2-column zigzags
  let bitIdx = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (!isFunc[r][c]) {
          const bit = bitIdx < stream.length ? stream[bitIdx++] === 1 : false;
          // Mask 0: (r + c) % 2 === 0
          modules[r][c] = (r + c) % 2 === 0 ? !bit : bit;
        }
      }
    }
    upward = !upward;
  }

  // Write format info bits (Level L = 0b01, Mask = 0): MSB (bit 14) -> LSB (bit 0)
  const fmt = formatBits(0b01, 0);
  const bitAt = (idxFromMsb: number) => ((fmt >> (14 - idxFromMsb)) & 1) === 1;
  for (let i = 0; i <= 5; i++) setFunc(8, i, bitAt(i));
  setFunc(8, 7, bitAt(6));
  setFunc(8, 8, bitAt(7));
  setFunc(7, 8, bitAt(8));
  for (let i = 9; i < 15; i++) setFunc(14 - i, 8, bitAt(i));

  for (let i = 0; i < 7; i++) setFunc(size - 1 - i, 8, bitAt(i));
  for (let i = 7; i < 15; i++) setFunc(8, size - 15 + i, bitAt(i));

  return modules;
}

function pushBitsTo(arr: number[], val: number, len: number) {
  for (let i = len - 1; i >= 0; i--) arr.push((val >> i) & 1);
}
