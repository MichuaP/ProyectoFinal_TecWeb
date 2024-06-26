import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTelefonoComponent } from './login-telefono.component';

describe('LoginTelefonoComponent', () => {
  let component: LoginTelefonoComponent;
  let fixture: ComponentFixture<LoginTelefonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTelefonoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
