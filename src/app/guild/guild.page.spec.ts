import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GuildPage } from './guild.page';

describe('GuildPage', () => {
  let component: GuildPage;
  let fixture: ComponentFixture<GuildPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuildPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GuildPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
