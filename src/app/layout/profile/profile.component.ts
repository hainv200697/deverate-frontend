import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedFile = null;
  account = [];
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getProfile().subscribe(
        (data) => {
            this.account = data['data']['data'];
        }
    );
}
  
  selectFile(event){
    this.selectedFile = event.target.files[0];
  }
  upload(){
    
  }
  updateProfile(){

  }
}
