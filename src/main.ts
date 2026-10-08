/// <reference types="@angular/localize" />
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { registerLicense } from '@syncfusion/ej2-base';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

registerLicense('Ngo9BigBOggjHTQxAR8/V1JHaF5cWWdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdlWXpcd3RXR2BYU0xyWUtWYEo=');




