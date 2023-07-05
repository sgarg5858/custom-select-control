import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ContentChildren, EventEmitter, HostListener, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { OptionComponent } from '../option/option.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations:[
    trigger('dropdown',[
    state('void',style({
      transform:'scaleY(0)',
      opacity:0
    })),
    state('*',style({
      transform:'scaleY(1)',
      opacity:1
    })),
      // :enter = void => *
      // :leave = * => void
      transition(':enter',[animate('320ms cubic-bezier(0,1,0.45,1.34)')]),
      transition(':leave',[animate('320ms cubic-bezier(0.88,-0.7,0.86,0.85)')])
  ]
    )
  ]
})
export class SelectComponent implements AfterViewInit{

  @Input() label="";

  // @Input() value :string | null = null;
  private selectionModel = new SelectionModel<string>();

  @Input() set value(value:string|null)
  {
    this.selectionModel.clear();
    if(value)
    {
      this.selectionModel.select(value);
    }
  }
  get value()
  {
    return this.selectionModel.selected[0] || null;
  }
  @Output() selectionChanged = new EventEmitter<string|null>();

  //Panel Open & CLose
  isOpen=false;
  @HostListener('click')
  openPanel(){
    this.isOpen=true
  }
  closePanel()
  {
    this.isOpen=false;
  }


  //Animation Code
  @Output() readonly opened = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<void>(); 

  onPanelAnimationDone({fromState,toState}:AnimationEvent)
  {
    if(fromState === 'void' && toState === null && this.isOpen )
    {
      this.opened.emit();
    }
    if(fromState === null && toState === 'void' && !this.isOpen )
    {
      this.closed.emit();
    }
  }

  
  //Highlighting the initial Selected Option

  //We are setting descendants=> true in case user puts the option components inside wrapper
  //component
  @ContentChildren(OptionComponent,{descendants:true}) options:QueryList<OptionComponent>|null =null;

  ngAfterViewInit(): void {
      this.highLightSelectedOption();  

  }

   

  highLightSelectedOption()
  {
    const selectedOption = this.findOptionByValue(this.value);
    selectedOption?.highLightAsSelected();
  }

  findOptionByValue(value:string|null)
  {
    const selectedOption = this.options?.find((option)=>option.value === value);
    return selectedOption;
  }

 

}
