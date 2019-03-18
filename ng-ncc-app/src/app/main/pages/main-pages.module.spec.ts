import { MainPagesModule } from './main-pages.module';

describe('MainPagesModule', () => {
    let pagesModule: MainPagesModule;

    beforeEach(() => {
        pagesModule = new MainPagesModule();
    });

    it('should create an instance', () => {
        expect(pagesModule).toBeTruthy();
    });
});
