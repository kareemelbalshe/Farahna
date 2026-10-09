import { LocalStorageService } from './local-storage.service';
import { IStorageService } from './storage.interface';

export * from './storage.interface';
export * from './local-storage.service';

// Default Storage Service (Local Disk)
export const storageService: IStorageService = new LocalStorageService();
