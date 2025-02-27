import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GridComponent} from "../grid/grid.component";
import {DescriptionComponent} from "./description/description.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GridComponent, DescriptionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lions-crown';
}
