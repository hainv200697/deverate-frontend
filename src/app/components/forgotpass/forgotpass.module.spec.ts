import { ForgotpassModule } from './forgotpass.module';

describe('SignupModule', () => {
  let forgotpassModule: ForgotpassModule;

  beforeEach(() => {
    forgotpassModule = new ForgotpassModule();
  });

  it('should create an instance', () => {
    expect(forgotpassModule).toBeTruthy();
  });
});
