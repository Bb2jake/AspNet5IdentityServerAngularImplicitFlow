import { NgModule } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { HttpModule, JsonpModule, Http } from '@angular/http';

import { SecureFileService } from './securefile/SecureFileService';
import { DataEventRecordsService } from './dataeventrecords/DataEventRecordsService';
import { DataEventRecord } from './dataeventrecords/models/DataEventRecord';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { SecureFilesComponent } from './securefile/securefiles.component';

import { DataEventRecordsListComponent } from './dataeventrecords/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './dataeventrecords/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './dataeventrecords/dataeventrecords-edit.component';

import { AuthModule } from './auth/modules/auth.module';
import { OidcSecurityService } from './auth/services/oidc.security.service';
import { OpenIDImplicitFlowConfiguration } from './auth/modules/auth.configuration';
import { ConfigService } from './ConfigService';

export function init(config: ConfigService) {
    return () => config.load();
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpModule,
        JsonpModule,
        AuthModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        ForbiddenComponent,
        HomeComponent,
        UnauthorizedComponent,
        SecureFilesComponent,
        DataEventRecordsListComponent,
        DataEventRecordsCreateComponent,
        DataEventRecordsEditComponent
    ],
    providers: [
        OidcSecurityService,
        SecureFileService,
        DataEventRecordsService,
        {
            'provide': APP_INITIALIZER,
            'useFactory': init,
            'deps': [ConfigService],
            'multi': true
        },
        ConfigService
    ],
    bootstrap:    [AppComponent],
})

export class AppModule {

    clientConfiguration: any;

    constructor(public oidcSecurityService: OidcSecurityService, private http: Http, private configService: ConfigService) {

        console.log('APP STARTING');

        this.clientConfiguration = this.configService;

        let openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = this.clientConfiguration.stsServer;
        openIDImplicitFlowConfiguration.redirect_url = this.clientConfiguration.redirect_url;
        // The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified by the iss (issuer) Claim as an audience.
        // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences not trusted by the Client.
        openIDImplicitFlowConfiguration.client_id = this.clientConfiguration.client_id;
        openIDImplicitFlowConfiguration.response_type = this.clientConfiguration.response_type;
        openIDImplicitFlowConfiguration.scope = this.clientConfiguration.scope;
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = this.clientConfiguration.post_logout_redirect_uri;
        openIDImplicitFlowConfiguration.start_checksession = this.clientConfiguration.start_checksession;
        openIDImplicitFlowConfiguration.silent_renew = this.clientConfiguration.silent_renew;
        openIDImplicitFlowConfiguration.startup_route = this.clientConfiguration.startup_route;
        // HTTP 403
        openIDImplicitFlowConfiguration.forbidden_route = this.clientConfiguration.forbidden_route;
        // HTTP 401
        openIDImplicitFlowConfiguration.unauthorized_route = this.clientConfiguration.unauthorized_route;
        openIDImplicitFlowConfiguration.log_console_warning_active = this.clientConfiguration.log_console_warning_active;
        openIDImplicitFlowConfiguration.log_console_debug_active = this.clientConfiguration.log_console_debug_active;
        // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
        // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = this.clientConfiguration.max_id_token_iat_offset_allowed_in_seconds;

        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
    }
}