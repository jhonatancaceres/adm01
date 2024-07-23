import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent {

}
