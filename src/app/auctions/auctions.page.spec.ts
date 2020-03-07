import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuctionsPage } from './auctions.page';

describe('AuctionsPage', () => {
  let component: AuctionsPage;
  let fixture: ComponentFixture<AuctionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
