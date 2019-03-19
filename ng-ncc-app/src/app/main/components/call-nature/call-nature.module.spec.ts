import { CallNatureModule } from './call-nature.module';

describe('CallNatureModule', () => {
  let callNatureModule: CallNatureModule;

  beforeEach(() => {
    callNatureModule = new CallNatureModule();
  });

  it('should create an instance', () => {
    expect(callNatureModule).toBeTruthy();
  });
});
