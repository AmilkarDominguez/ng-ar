import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EXPERIENCES } from '../experiences';

/**
 * Home menu: lists the available AR test experiences. Each entry maps to a lazy
 * route in `app.routes.ts`. Extend the list in `experiences.ts`.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly experiences = EXPERIENCES;
}
