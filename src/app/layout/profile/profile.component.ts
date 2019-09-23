import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedFile = null;
  constructor() { }

  ngOnInit() {
  }
  selectFile(event){
    this.selectedFile = event.target.files[0];
  }
  upload(){
    
  }

}
