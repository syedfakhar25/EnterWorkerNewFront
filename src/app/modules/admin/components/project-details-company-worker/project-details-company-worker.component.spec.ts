import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsCompanyWorkerComponent } from './project-details-company-worker.component';

describe('ProjectDetailsCompanyWorkerComponent', () => {
  let component: ProjectDetailsCompanyWorkerComponent;
  let fixture: ComponentFixture<ProjectDetailsCompanyWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailsCompanyWorkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsCompanyWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
