import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RaidsPage } from './raids.page';

describe('RaidsPage', () => {
  let component: RaidsPage;
  let fixture: ComponentFixture<RaidsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaidsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RaidsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
