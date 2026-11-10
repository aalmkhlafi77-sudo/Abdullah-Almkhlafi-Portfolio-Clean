export interface MediaRecord {
  id: string;
  storageName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  publicUrl: string;
  createdBy: number;
}

export interface MediaRepository {
  insert(record: MediaRecord): Promise<MediaRecord>;
  findById(id: string): Promise<MediaRecord | null>;
  delete(id: string): Promise<void>;
}
