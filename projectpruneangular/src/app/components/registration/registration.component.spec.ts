import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        RegistrationComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RegistrationComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'projectpruneangular'`, () => {
    const fixture = TestBed.createComponent(RegistrationComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('projectpruneangular');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to projectpruneangular!');
  });
});
