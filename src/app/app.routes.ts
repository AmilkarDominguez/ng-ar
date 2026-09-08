import { Routes } from '@angular/router';

/**
 * `''` shows the test menu (`Home`); each AR experience is a lazy route whose
 * `path` matches an entry in `experiences.ts`. Add both together.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'mindar',
    loadComponent: () => import('./ar-viewer/ar-viewer').then((m) => m.ArViewer),
  },
  {
    path: 'ios-quick-look',
    loadComponent: () =>
      import('./ios-quick-look/ios-quick-look').then((m) => m.IosQuickLook),
  },
  { path: '**', redirectTo: '' },
];
