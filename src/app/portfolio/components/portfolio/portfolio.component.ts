import { Component, OnInit } from '@angular/core';
import { BalanceComponent } from '../balance/balance.component';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, RouterLink, RouterOutlet, RouterStateSnapshot } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from '../assets/assets.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [BalanceComponent, AssetsComponent, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {


  selectedTab: string = 'balance';

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.selectedTab = params['p'] || 'balance'
    });

  }


}
