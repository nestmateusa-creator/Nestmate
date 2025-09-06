const assert = require('chai').assert;
const { findWidgetNeedingAttention } = require('../scripts/dashboard.helpers.js');

describe('Section attention detection', ()=>{
  it('returns home_summary when missing address/year', ()=>{
    const id = findWidgetNeedingAttention({}, ['home_summary','roof','appliances']);
    assert.equal(id, 'home_summary');
  });
  it('returns roof when home summary ok but roof missing', ()=>{
    const data = { address: '1 Main St', yearBuilt: 1990 };
    const id = findWidgetNeedingAttention(data, ['home_summary','roof','appliances']);
    assert.equal(id, 'roof');
  });
  it('returns null when nothing missing', ()=>{
    const data = { address:'1 Main St', yearBuilt:2000, roofAge:5, appliancesCondition:8 };
    const id = findWidgetNeedingAttention(data, ['home_summary','roof','appliances']);
    assert.isNull(id);
  });
});
