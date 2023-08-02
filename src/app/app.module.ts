import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule, DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustomHttpInterceptor } from './shared/interceptors/custom-http.interceptor';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { NotificationService } from './shared/notification.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { FirebaseService } from './services/firebase.service';
import { NotificationModule } from './shared/components/notification/notification.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from './shared/app-config.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function initAppConfig(appConfigService: AppConfigService) {
    return () => appConfigService.load();
 }

@NgModule({
    declarations: [
      AppComponent,
    ],
    imports: [
      NotificationModule,
      CommonModule,
      HttpClientModule,
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireMessagingModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    ],
    providers: [
      DatePipe,
      FirebaseService,
      { provide: LocationStrategy, useClass: PathLocationStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
      MessageService,
      NotificationService,
      AppConfigService,

    {
      provide: APP_INITIALIZER,
      useFactory: initAppConfig,
      deps: [AppConfigService],
      multi: true,
    },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
