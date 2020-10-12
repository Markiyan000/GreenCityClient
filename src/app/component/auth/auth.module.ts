import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { InputcolorDirective } from '../../directives/inputcolor.directive';
import { SharedModule } from '@shared/shared.module';
import {
  RestoreComponent,
  RestorePasswordComponent,
  SignInComponent,
  SignUpComponent,
  SubmitEmailComponent
} from './components';
import { AuthSelectors } from './store/auth.selectors';
import { ConfirmRestorePasswordComponent } from './components/confirm-restore-password/confirm-restore-password.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

@NgModule({
  declarations: [
    SignUpComponent,
    SignInComponent,
    RestorePasswordComponent,
    InputcolorDirective,
    SubmitEmailComponent,
    RestoreComponent,
    ConfirmRestorePasswordComponent,
    ErrorMessageComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    SignInComponent,
    SignUpComponent,
    RestorePasswordComponent,
    SubmitEmailComponent,
    ConfirmRestorePasswordComponent
  ],
  exports: [
    InputcolorDirective
  ],
  providers: [
    AuthSelectors
  ]
})

export class AuthModule { }
