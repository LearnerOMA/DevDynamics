// src/utils/calculateSettlements.js
export function calculate(persons, expenses) {
  const net = Object.fromEntries(persons.map(p=>[p,0]));

  expenses.forEach(e => {
    const amt = e.amount;
    if (e.splits && e.splits.length) {
      e.splits.forEach(s => net[s.person] -= s.share);
      net[e.paid_by] += amt;
    } else {
      const ppl = e.split_between;
      const share = amt / ppl.length;
      ppl.forEach(p => net[p] -= share);
      net[e.paid_by] += amt;
    }
  });

  const debtors = [], creditors = [];
  for (let p of persons) {
    const bal = +net[p].toFixed(2);
    if (bal < 0) debtors.push({ person: p, amt: -bal });
    if (bal > 0) creditors.push({ person: p, amt: bal });
  }

  const settlements = [];
  let i=0, j=0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i], c = creditors[j];
    const x = Math.min(d.amt, c.amt);
    settlements.push({ from: d.person, to: c.person, amount: x });
    d.amt -= x; c.amt -= x;
    if (d.amt === 0) i++;
    if (c.amt === 0) j++;
  }

  return { net, settlements };
}
