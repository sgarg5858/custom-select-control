import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select/select.component';
import { OptionComponent } from './option/option.component';
import { OverlayModule } from '@angular/cdk/overlay';



@NgModule({
  declarations: [
    SelectComponent,
    OptionComponent
  ],
  imports: [
    CommonModule,OverlayModule
  ],exports:[
    SelectComponent,OptionComponent
  ]
})
export class SelectModule { }
