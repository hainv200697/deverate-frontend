import { Component,Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

    constructor(

    ) { }

    @Input() message : any[];
    
    ngOnInit() {
      console.log(this.message);
    }
}