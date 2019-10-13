import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reranking',
  templateUrl: './reranking.component.html',
  styleUrls: ['./reranking.component.scss']
})
export class RerankingComponent implements OnInit {

  constructor(private modalService: NgbModal,) { }

  ngOnInit() {
  }

  open(){
    this.modalService.open("quiznow", { size: 'lg',   ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

});
}

closeModal() {
this.modalService.dismissAll();
}

}
