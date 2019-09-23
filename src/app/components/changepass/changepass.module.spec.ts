import { ChangepassModule } from './changepass.module';

describe('SignupModule', () => {
  let changepassModule: ChangepassModule;

  beforeEach(() => {
    changepassModule = new ChangepassModule();
  });

  it('should create an instance', () => {
    expect(changepassModule).toBeTruthy();
  });
});
