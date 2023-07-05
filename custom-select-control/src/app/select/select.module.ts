import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select/select.component';
import { OptionComponent } from './option/option.component';



@NgModule({
  declarations: [
    SelectComponent,
    OptionComponent
  ],
  imports: [
    CommonModule
  ],exports:[
    SelectComponent,OptionComponent
  ]
})
export class SelectModule { }
