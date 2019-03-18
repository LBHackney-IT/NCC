import { OrModule } from './or.module';

describe('OrModule', () => {
  let orModule: OrModule;

  beforeEach(() => {
    orModule = new OrModule();
  });

  it('should create an instance', () => {
    expect(orModule).toBeTruthy();
  });
});
