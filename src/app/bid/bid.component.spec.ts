import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BidComponent } from './bid.component';

describe('BidComponent', () => {
  let component: BidComponent;
  let fixture: ComponentFixture<BidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
