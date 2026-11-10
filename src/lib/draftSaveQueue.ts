export interface DraftSaveApi<Snapshot, Published> {
  saveDraft(snapshot: Snapshot, expectedVersion: number): Promise<{ snapshot: Snapshot; draftVersion: number }>;
  publish(expectedVersion: number): Promise<Published>;
}

export const createDraftSaveQueue = <Snapshot, Published>(
  api: DraftSaveApi<Snapshot, Published>,
  initialVersion = 0,
) => {
  let version = initialVersion;
  let tail: Promise<void> = Promise.resolve();

  return {
    get version() { return version; },
    setVersion(value: number) { version = value; },
    save(snapshot: Snapshot, shouldPublish = false) {
      const operation = tail.then(async () => {
        const saved = await api.saveDraft(snapshot, version);
        version = saved.draftVersion;
        const published = shouldPublish ? await api.publish(version) : undefined;
        return { saved, published };
      });
      tail = operation.then(() => undefined, () => undefined);
      return operation;
    },
    importSnapshot(
      snapshot: Snapshot,
      importer: (snapshot: Snapshot, expectedVersion: number) => Promise<{ snapshot: Snapshot; draftVersion: number }>,
    ) {
      const operation = tail.then(async () => {
        const imported = await importer(snapshot, version);
        version = imported.draftVersion;
        return imported;
      });
      tail = operation.then(() => undefined, () => undefined);
      return operation;
    },
  };
};
