import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'custom-select-control';

  constructor(private cd:ChangeDetectorRef){}

  initialValue=new User(1,'sanjay','sanjay','india',true);
  
  users:User[]=[
    new User(1,'sanjay','sanju','india',false),
    new User(2,'shiva','babbu','uk',false),
    new User(3,'neeraj','neeraj','ireland',false),
    new User(1,'nitish','nitish','india',true),
  ]
  ngOnInit(): void {
      setTimeout(()=>{
        console.log("Ran")
       this.initialValue=this.users[1];
       this.cd.markForCheck();
      },2000)
  }

  displayFn=(user:User)=>user.name;
}
