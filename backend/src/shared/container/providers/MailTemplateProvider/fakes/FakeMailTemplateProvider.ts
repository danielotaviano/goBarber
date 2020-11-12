import IMailTemplateProvider from '../models/IMailTempleteProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}
