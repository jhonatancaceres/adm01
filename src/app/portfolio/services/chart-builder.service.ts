import { ElementRef, Injectable } from "@angular/core";
import { GeneralData } from "../types";
import Chart from 'chart.js/auto'
import { MONTHS } from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class ChartBuilderService {


  build(id: string, { accounts, general }: GeneralData, context: any) {


    let config: any = {
      type: null,
      data: null,
    };

    if (id === 'pieByAccounts') {
      const labels = accounts.map(({ name }) => name);
      const ids = accounts.map(({ id }) => id);
      const maxPeriod = Math.max(...Object.keys(general).map(k => Number(k)))

      const gMaxPeriod: { [id: number]: { amount: number } } = general[maxPeriod];

      const data = ids.reduce((prev: number[], cur: any) =>
        [...prev, (gMaxPeriod[cur] ? gMaxPeriod[cur].amount : 0)]
        , []);
      config = {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            label: '# of Votes',
            data,
            borderWidth: 1,
            hoverOffset: 4
          }]
        }
      }
    }

    if (id === 'lineByAccounts') {
      const periods = Object.keys(general);
      const labels = periods.map(p => MONTHS[Number(`${p}`.substring(4))]);      
      const datasets = accounts.map(({ id, name }) => ({
        label: name,
        data: periods.map(p => general[p][id]?.amount),
        fill: false,
        tension: 0.1
      }));

      config = {
        type: 'line',
        data: {
          labels,
          datasets
        },
      };
    }

    return new Chart(context, config);



  }



}