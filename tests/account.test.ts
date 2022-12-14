/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import { expect } from 'chai';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { getMethodTeal, lowerFirstChar } from './common';
import * as langspec from '../src/langspec.json';

async function getTeal(methodName: string, length: number) {
  return getMethodTeal('tests/contracts/account.ts', 'AccountTest', methodName, length);
}

describe('Account', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  langspec.Ops.find((op) => op.Name === 'acct_params_get')!.ArgEnum!.forEach((a) => {
    const fn = lowerFirstChar(a.replace('Acct', ''));
    it(fn, async function () {
      expect(await getTeal(fn, 4)).to.deep.equal([
        `// assert(a.${fn})`,
        'frame_dig -1 // a: Account',
        `acct_params_get ${a}`,
        'assert',
      ]);
    });
  });

  it('assetBalance', async function () {
    expect(await getTeal('assetBalance', 5)).to.deep.equal([
      '// assert(a.assetBalance(123))',
      'frame_dig -1 // a: Account',
      'int 123',
      'asset_holding_get AssetBalance',
      'assert',
    ]);
  });

  it('assetFrozen', async function () {
    expect(await getTeal('assetFrozen', 5)).to.deep.equal([
      '// assert(a.assetFrozen(123))',
      'frame_dig -1 // a: Account',
      'int 123',
      'asset_holding_get AssetFrozen',
      'assert',
    ]);
  });

  it('hasAsset', async function () {
    expect(await getTeal('hasAsset', 6)).to.deep.equal([
      '// assert(a.hasAsset(123))',
      'frame_dig -1 // a: Account',
      'int 123',
      'asset_holding_get AssetBalance',
      'swap',
      'pop',
    ]);
  });
});
