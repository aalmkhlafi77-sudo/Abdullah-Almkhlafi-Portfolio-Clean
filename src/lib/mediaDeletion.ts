export interface MediaDeletionDependencies {
  saveDraftWithoutMedia(): Promise<void>;
  deleteMediaFile(id: string): Promise<void>;
}

export const persistMediaDeletion = async (
  id: string,
  dependencies: MediaDeletionDependencies,
): Promise<void> => {
  await dependencies.saveDraftWithoutMedia();
  await dependencies.deleteMediaFile(id);
};
