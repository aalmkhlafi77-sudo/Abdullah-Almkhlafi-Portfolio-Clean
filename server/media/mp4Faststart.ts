/** Move a conventional, non-fragmented MP4's movie index ahead of its media data.
 * Unsupported layouts are left untouched; this never re-encodes the video.
 */
type Box = { type: string; start: number; end: number };

const readBoxes = (buffer: Buffer, start: number, end: number): Box[] | null => {
  const boxes: Box[] = [];
  for (let pos = start; pos < end;) {
    if (end - pos < 8) return null;
    const length = buffer.readUInt32BE(pos);
    if (length < 8 || length > end - pos) return null;
    boxes.push({ type: buffer.toString('ascii', pos + 4, pos + 8), start: pos, end: pos + length });
    pos += length;
  }
  return boxes;
};

const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl']);

const patchOffsets = (movie: Buffer, mediaStart: number, mediaEnd: number): boolean => {
  let entriesFound = 0;
  const walk = (start: number, end: number, insideSampleTable: boolean): boolean => {
    const boxes = readBoxes(movie, start, end);
    if (!boxes) return false;
    for (const box of boxes) {
      if (CONTAINERS.has(box.type)) {
        if (!walk(box.start + 8, box.end, insideSampleTable || box.type === 'stbl')) return false;
      } else if (insideSampleTable && (box.type === 'stco' || box.type === 'co64')) {
        const width = box.type === 'stco' ? 4 : 8;
        if (box.end - box.start < 16 || movie.readUInt8(box.start + 8) !== 0) return false;
        const count = movie.readUInt32BE(box.start + 12);
        if (count > Math.floor((box.end - box.start - 16) / width)) return false;
        // Validate the entire table before changing any bytes.
        for (let index = 0; index < count; index++) {
          const at = box.start + 16 + index * width;
          const offset = width === 4 ? BigInt(movie.readUInt32BE(at)) : movie.readBigUInt64BE(at);
          if (offset < BigInt(mediaStart) || offset >= BigInt(mediaEnd)) return false;
          if (width === 4 && offset + BigInt(movie.length) > 0xffffffffn) return false;
        }
        for (let index = 0; index < count; index++) {
          const at = box.start + 16 + index * width;
          if (width === 4) movie.writeUInt32BE(movie.readUInt32BE(at) + movie.length, at);
          else movie.writeBigUInt64BE(movie.readBigUInt64BE(at) + BigInt(movie.length), at);
        }
        entriesFound += count;
      }
    }
    return true;
  };
  return walk(8, movie.length, false) && entriesFound > 0;
};

export const faststartMp4 = (source: Buffer): Buffer => {
  const boxes = readBoxes(source, 0, source.length);
  if (!boxes || boxes[0]?.type !== 'ftyp') return source;
  const movies = boxes.filter((box) => box.type === 'moov');
  const media = boxes.filter((box) => box.type === 'mdat');
  if (movies.length !== 1 || media.length !== 1) return source;
  const movie = movies[0];
  const data = media[0];
  if (movie.start < data.start || movie.end !== source.length) return source;
  // Only relocate a standard 32-bit moov. Other MP4 layouts remain playable as uploaded.
  if (movie.end - movie.start > 1024 * 1024) return source;
  const patchedMovie = Buffer.from(source.subarray(movie.start, movie.end));
  if (!patchOffsets(patchedMovie, data.start + 8, data.end)) return source;
  return Buffer.concat([source.subarray(0, boxes[0].end), patchedMovie, source.subarray(boxes[0].end, movie.start)]);
};
