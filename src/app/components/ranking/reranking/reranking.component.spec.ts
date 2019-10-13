import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RerankingComponent } from './reranking.component';

describe('RerankingComponent', () => {
  let component: RerankingComponent;
  let fixture: ComponentFixture<RerankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RerankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RerankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
