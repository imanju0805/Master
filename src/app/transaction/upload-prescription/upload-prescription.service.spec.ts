import { TestBed } from '@angular/core/testing';

import { UploadPrescriptionService } from './upload-prescription.service';

describe('UploadPrescriptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadPrescriptionService = TestBed.get(UploadPrescriptionService);
    expect(service).toBeTruthy();
  });
});
