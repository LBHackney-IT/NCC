import { ValueListModule } from './value-list.module';

describe('ValueListModule', () => {
  let valueListModule: ValueListModule;

  beforeEach(() => {
    valueListModule = new ValueListModule();
  });

  it('should create an instance', () => {
    expect(valueListModule).toBeTruthy();
  });
});
