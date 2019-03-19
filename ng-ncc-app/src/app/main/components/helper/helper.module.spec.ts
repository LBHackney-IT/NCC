import { HelperModule } from './helper.module';

describe('HelperModule', () => {
  let helperModule: HelperModule;

  beforeEach(() => {
    helperModule = new HelperModule();
  });

  it('should create an instance', () => {
    expect(helperModule).toBeTruthy();
  });
});
