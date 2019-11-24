import { AccountApiService } from 'src/app/services/account-api.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  selectedFile;
  account : any = {
    username: "",
    fullname: "",
    phone: "",
    email: "",
    address: "",
    gender : true,
  };
  accountId;
  loading = false;
  constructor(
    private accountApi: AccountApiService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.accountId = localStorage.getItem('AccountId');
    this.getProfile(this.accountId);
  }

  getProfile(accountId) {
    this.loading = true;
    this.accountApi.getProfile(accountId).subscribe(
      (data) => {
        this.account = data;
        this.loading = false;
      },
      (error) => {
        if (error.status == 0) {
          this.toast.error('Server is not availiable');
        }
        if (error.status == 404) {
          this.toast.error('Not found');
        }
        if (error.status == 500) {
          this.toast.error('Server error');
        }
        this.loading = false;
      }
    );
  }
  updateProfile() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The profile will be update!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.accountApi.updateProfileInfo(this.account).subscribe(data => {
          this.getProfile(this.accountId);
          this.toast.success('Update profile successful');
          this.loading = false;
        }, (error) => {
          if (error.status == 0) {
            this.toast.error('Server is not availiable');
          }
          if (error.status == 404) {
            this.toast.error('Not found');
          }
          if (error.status == 500) {
            this.toast.error('Server error');
          }
          this.loading = false;
        });
      }
    });
  }
}
