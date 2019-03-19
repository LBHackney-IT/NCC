import { BackLinkModule } from './back-link.module';

describe('BackLinkModule', () => {
  let backLinkModule: BackLinkModule;

  beforeEach(() => {
    backLinkModule = new BackLinkModule();
  });

  it('should create an instance', () => {
    expect(backLinkModule).toBeTruthy();
  });
});
