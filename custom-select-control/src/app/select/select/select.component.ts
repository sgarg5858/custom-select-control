import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, HostListener, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { OptionComponent } from '../option/option.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, merge, startWith, switchMap, takeUntil, tap } from 'rxjs';

export type SelectValueType<T> = T | null;

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
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
export class SelectComponent<T> implements AfterContentInit,OnDestroy{

  @Input() label="";
  constructor(private cd:ChangeDetectorRef){}

  //Display value for objects
  @Input() displayWith :((value:T)=>string|number)|null = null;

  protected get displayValue(){
    if(this.displayWith && this.value)
    {
      return this.displayWith(this.value);
    }
    return this.value;
  }

  //Comparing Objects, by default we give the implementation for primitives
  @Input() compareWith = (a:T|null,b:T|null) => a===b;

  // @Input() value :string | null = null;
  private selectionModel = new SelectionModel<T>(undefined,undefined,undefined,this.compareWith);

  @Input() set value(value:SelectValueType<T>)
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
  @Output() selectionChanged = new EventEmitter<SelectValueType<T>>();

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
  @ContentChildren(OptionComponent,{descendants:true}) options:QueryList<OptionComponent<T>>|null =null;

  ngAfterContentInit(): void {


      this.selectionModel.changed.pipe(
        takeUntil(this.subject)
      )
      .subscribe((values)=>{
        console.log(values);
        //For deselecting unselected values
        values.removed.forEach((value)=>{
          this.findOptionByValue(value)?.deselect();
        })
        // If the values changes for select later on
        values.added.forEach((value)=>{
          this.findOptionByValue(value)?.highLightAsSelected();
        })
      })

      //Listening to Option Select events,
      // As they are rendered via Content Projection
      this.options?.changes.pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        //This will run also when the options values changes too.
        tap(()=>{
          this.highLightSelectedOption();  
        }),
        switchMap((options)=> merge(...options.map(o=>o.selected))),
        takeUntil(this.subject)
      ).subscribe((selectionOption)=>{
        this.handleSelection(selectionOption);
      })
    }

    handleSelection(selectedOption:OptionComponent<T>)
    {
      if(selectedOption.value)
      {
       //Toggle is imp to as if value is already selected it will handle that 
      this.selectionModel.toggle(selectedOption.value);
      this.selectionChanged.emit(selectedOption.value);
      this.closePanel();
      this.cd.markForCheck();
      }
    }

  highLightSelectedOption()
  {
    const selectedOption = this.findOptionByValue(this.value);
    selectedOption?.highLightAsSelected();
  }

  findOptionByValue(value:T|null)
  {
    const selectedOption = this.options?.find((option)=>this.compareWith(option.value,value));
    return selectedOption;
  }

  //Unsubscription Logic
  private subject = new Subject<void>();
  ngOnDestroy(): void {
      this.subject.next();
      this.subject.complete();
  }

}
