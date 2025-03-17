import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDealsComponent } from './edit-deals.component';

describe('EditDealsComponent', () => {
  let component: EditDealsComponent;
  let fixture: ComponentFixture<EditDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDealsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
