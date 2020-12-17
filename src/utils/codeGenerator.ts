import Crypto from 'crypto';

function emailCodeGen(size = 64): string {
  return Crypto.randomBytes(size).toString('hex').slice(0, size);
}

function phoneCodeGen(size = 6): string {
  return Math.abs(
    Crypto.randomBytes(4).readInt32BE(0) % Math.pow(10, size)
  ).toString();
}

export { emailCodeGen, phoneCodeGen };
