import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

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
export class SelectComponent {

  @Input() label="Pick the user";
  @Input() value :string | null = null;

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


}
