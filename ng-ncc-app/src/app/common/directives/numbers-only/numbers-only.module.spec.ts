import { NumbersOnlyModule } from './numbers-only.module';

describe('NumbersOnlyModule', () => {
  let numbersOnlyModule: NumbersOnlyModule;

  beforeEach(() => {
    numbersOnlyModule = new NumbersOnlyModule();
  });

  it('should create an instance', () => {
    expect(numbersOnlyModule).toBeTruthy();
  });
});
