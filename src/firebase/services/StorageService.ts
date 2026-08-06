export interface IStorageService {
  uploadResume(userId: string, file: File): Promise<string>;
  uploadCompanyLogo(companyId: string, file: File): Promise<string>;
  uploadAvatar(userId: string, file: File): Promise<string>;
  deleteFile(path: string): Promise<void>;
}

export class StorageService implements IStorageService {
  async uploadResume(_userId: string, _file: File): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async uploadCompanyLogo(_companyId: string, _file: File): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async uploadAvatar(_userId: string, _file: File): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async deleteFile(_path: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
