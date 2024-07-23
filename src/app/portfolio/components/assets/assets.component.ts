import { Component } from '@angular/core';
import { BalanceService } from '../../services/balance.service';
import { AssetItem, Year } from '../../types';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent {

  years: Year[] = [];
  selectedYear?: number;
  data: AssetItem[] = [];

  constructor(private balanceService: BalanceService) {

  }


  ngOnInit(): void {
    this.balanceService.getYears().pipe(switchMap(data => {
      this.years = data;
      this.selectedYear = this.years.find(({ current }) => current)?.year;
      return this.balanceService.getAssetItems({ year: this.selectedYear });
    })).subscribe(
      (data) => {
        this.data = data;
      }
    );

  }

  selectYear(year?: number) {
    this.selectedYear = year;
    this.balanceService.getAssetItems({ year: this.selectedYear }).subscribe(data => this.data = data);
  }

}
