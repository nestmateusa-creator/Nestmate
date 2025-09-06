const assert = require('chai').assert;
const { calculateHealthScore } = require('../scripts/dashboard.testable.js');

describe('Home Health Score', ()=>{
  it('returns number between 10 and 99', ()=>{
    const s = calculateHealthScore({ yearBuilt: 2020, roofAge: 2, windowsAge: 3, renovationScore: 8, appliancesCondition: 8 });
    assert.isNumber(s);
    assert.isAtLeast(s, 10);
    assert.isAtMost(s, 99);
  });

  it('improves with newer yearBuilt', ()=>{
    const oldS = calculateHealthScore({ yearBuilt: 1980, roofAge: 15, windowsAge: 20, renovationScore: 2, appliancesCondition: 3 });
    const newS = calculateHealthScore({ yearBuilt: 2020, roofAge: 2, windowsAge: 2, renovationScore: 8, appliancesCondition: 8 });
    assert.isBelow(oldS, newS);
  });

  it('clamps to minimum 10 for poor homes', ()=>{
    const s = calculateHealthScore({ yearBuilt: 1900, roofAge: 80, windowsAge: 80, renovationScore: 0, appliancesCondition: 0 });
    assert.isAtLeast(s, 10);
  });
});
