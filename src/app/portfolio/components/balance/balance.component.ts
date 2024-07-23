import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, AssetItem, Year } from '../../types';
import { BalanceService } from '../../services/balance.service';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  providers: [BalanceService]
})
export class BalanceComponent implements OnInit {

  years: Year[] = [];
  selectedYear?: number;
  data?: { general: any, periods: { ym: number, date: Date }[], accounts: Account[], kpi: any };

  constructor(private balanceService: BalanceService) {

  }


  ngOnInit(): void {
    this.balanceService.getYears().pipe(switchMap(data => {
      this.years = data;
      this.selectedYear = this.years.find(({ current }) => current)?.year;
      return this.balanceService.getBalance({ year: this.selectedYear });
    })).subscribe(
      (data) => {
        this.data = data;
      }
    );

  }

  selectYear(year?: number) {
    this.selectedYear = year;
    this.balanceService.getBalance({ year: this.selectedYear }).subscribe(data => this.data = data);
  }

  getAmount(period: number, accountId: number | string) {
    const d = this.data?.general
    return d && d[period] && d[period][accountId]?.amount;
  }


}