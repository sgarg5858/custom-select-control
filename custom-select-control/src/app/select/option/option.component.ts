import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent<T> {

  @Input() value:T|null =null;

 //Disable Functionality:

  @HostBinding('class.disabled')
  @Input() disabled =false;

  @Input() disableReason: string | null = null;

  //Selecte Functionality:


  @Output() selected = new EventEmitter<OptionComponent<T>>();

  @HostBinding('class.selected')
  protected isSelected=false;

  @HostListener('click')
  select()
  {
    if(this.disabled) return;
    this.isSelected=true;
    this.selected.emit(this);
  }

  highLightAsSelected()
  {
    this.isSelected=true;
  }

  deselect(){
    this.isSelected=false;
  }
}
