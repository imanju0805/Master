import { TestBed } from '@angular/core/testing';

import { AddressSelectionService } from './address-selection.service';

describe('AddressSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddressSelectionService = TestBed.get(AddressSelectionService);
    expect(service).toBeTruthy();
  });
});
