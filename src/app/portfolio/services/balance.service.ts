import { Injectable } from '@angular/core';
import { AssetsFilters, Year } from '../types';
import data from '../../data.json';
import { Observable, of } from 'rxjs';

const sum = (array: Array<any>, key?: string): number =>
  array.reduce((prev, cur: any) => prev + (key ? cur[key] : cur), 0);

const avg = (array: Array<any>, key?: string): number => {
  const t = array.map(r => (key ? r[key] : r)).filter(r => r > 0);  
  return sum(t) / t.length;
}


const getYm = (date: Date): number =>
  Number(date.getFullYear() + '' + date.getMonth())

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor() { }

  getYears(): Observable<Year[]> {

    const current = (new Date()).getFullYear()

    const d = data.balance.map(({ date }) => (new Date(date)).getFullYear()).reduce((prev: number[], cur: number) => {
      if (!prev.includes(cur)) {
        prev.push(cur)
      }
      return prev;
    }, []).sort().reverse().map(year => ({ year, current: year === current }));

    return of(d);
  }

  getAssetItems(filters: AssetsFilters) {

    const d = data.balance.map((r, i) => ({ ...r, date: new Date(r.date), id: (i + 1) })).filter(({ date }) => !filters?.year || filters?.year === date.getFullYear());
    return of(d);
  }

  getBalance(filters: AssetsFilters) {

    const d = data.balance.map((r, i) => ({ ...r, date: new Date(r.date), id: (i + 1) })).map(r => ({ ...r, ym: getYm(r.date) })).filter(({ date }) => !filters?.year || filters?.year === date.getFullYear())
    //.sort(({ ym: a }, { ym: b }) => a - b);
    const periodIds = [...new Set(d.map(({ ym }) => ym))];
    const accountIds = [...new Set(d.map(({ account }) => account.id))];
    const accounts = data.accounts.filter(({ id }) => accountIds.includes(id));
    const periods = periodIds.map(ym => {
      const year = Number(`${ym}`.substring(0, 4));
      const month = Number(`${ym}`.substring(4));
      const ymPrev = month > 0 ? Number(`${year}${month - 1}`) : null;
      return { ym, ymPrev, date: new Date(year, month, 1) }
    }).sort(({ ym: a }, { ym: b }) => a - b);
    const periodsMap = periods.reduce((prev: any, cur: any) => ({ ...prev, [cur.ym]: cur }), {});

    const incomes: { [key: number]: number } = Object.keys(data.incomes).reduce((prev, cur: string) => {
      const ym = getYm(new Date(cur));
      return { ...prev, [ym]: sum((data.incomes as any)[cur]) }
    }, {});

    const general: { [ymAcc: string]: { [accountId: number | string]: { amount: number } } } = {};
    d.forEach(({ ym, account, amount }) => {
      general[ym] = { ...general[ym], [account.id]: { amount } };
    });
    periods.forEach(({ ym }) => {
      general[ym]['total'] = { amount: sum(Object.values(general[ym]), 'amount') };
    });
    periods.forEach(({ ym }) => {
      const currentValue = general[ym]['total'].amount;
      const prevAmount = general[periodsMap[ym].ymPrev] ? general[periodsMap[ym].ymPrev]['total'].amount : 0;
      general[ym]['diff'] = { amount: prevAmount ? currentValue - prevAmount : 0 };
      general[ym]['incomes'] = { amount: incomes[ym] };
      general[ym]['expenses'] = { amount: general[ym]['diff'].amount > 0 ? general[ym]['incomes'].amount - general[ym]['diff'].amount : 0 }
    });

    const kpi: { [key: string]: number } = ['diff', 'incomes', 'expenses'].reduce((prev, kpi) => ({
      ...prev, [kpi]: { avg: avg(periods.map(({ ym }) => general[ym][kpi].amount)) }
    }), {});
    console.log(kpi)

    return of({ accounts, periods, general, kpi });
  }








}

//.sort(({ date: a }, { date: b }) => b.getTime() - a.getTime());