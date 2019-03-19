import { NoteFormModule } from './note-form.module';

describe('NoteFormModule', () => {
  let noteFormModule: NoteFormModule;

  beforeEach(() => {
    noteFormModule = new NoteFormModule();
  });

  it('should create an instance', () => {
    expect(noteFormModule).toBeTruthy();
  });
});
