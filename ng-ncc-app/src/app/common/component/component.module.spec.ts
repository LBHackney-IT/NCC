import { ComponentModule } from './component.module';

describe('ComponentModule', () => {
  let componentModule: ComponentModule;

  beforeEach(() => {
    componentModule = new ComponentModule();
  });

  it('should create an instance', () => {
    expect(componentModule).toBeTruthy();
  });
});
