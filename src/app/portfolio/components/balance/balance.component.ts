import { AfterViewInit, Component, ElementRef, OnInit, QueryList, viewChild, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, AssetItem, Year } from '../../types';
import { BalanceService } from '../../services/balance.service';
import { switchMap, of } from 'rxjs';

import { ChartBuilderService } from '../../services/chart-builder.service';
import { Chart } from 'chart.js';
import { ShortNumberPipe } from '../../../pipes/short-number.pipe';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, ShortNumberPipe],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  providers: [BalanceService, ChartBuilderService]
})
export class BalanceComponent implements OnInit, AfterViewInit {

  years: Year[] = [];
  selectedYear?: number;
  data?: { general: any, periods: { ym: number, date: Date }[], accounts: Account[], kpi: any };

  @ViewChildren('chartRefs') chartRefs!: QueryList<ElementRef>;

  charts: { id: string, instance?: Chart<any> }[] = [{ id: 'pieByAccounts' }, { id: 'lineByAccounts' }];

  constructor(private balanceService: BalanceService, private chartBuilder: ChartBuilderService) {

  }


  ngOnInit(): void {
    this.balanceService.getYears().pipe(switchMap(data => {
      this.years = data;
      this.selectedYear = this.years.find(({ current }) => current)?.year;
      return this.balanceService.getBalance({ year: this.selectedYear });
    })).subscribe(
      (data) => {
        this.data = data;
        this.loadCharts();
      }
    );

  }
  ngAfterViewInit() {
    this.loadCharts();
  }

  selectYear(year?: number) {
    this.selectedYear = year;
    this.balanceService.getBalance({ year: this.selectedYear }).subscribe(data => {
      this.data = data;
      this.loadCharts(true);
    });
  }

  /*getPeriod(date: Date) {
    if (this.selectedYear)
  }*/

  getAmount(period: number, accountId: number | string) {
    const d = this.data?.general
    return d && d[period] && d[period][accountId]?.amount;
  }

  loadCharts(reset: boolean = false) {

    if (reset) {

      this.charts.forEach(({ instance }) => {
        instance?.destroy()
      });

    }

    if (!this.data?.accounts?.length) {
      console.log('No data loaded');
      return;
    }

    if (!this.chartRefs) {
      console.log('No instance loaded');
      return;
    }
    this.charts.forEach((chart, i) => {
      const ref = this.chartRefs.get(i);
      if (this.data && ref) {
        chart.instance = this.chartBuilder.build(chart.id, this.data, ref.nativeElement);
      }
    })
  }


}