import type FileModel from '../fileModel';

import AllowedSeconds from './allowedSeconds';

type BandMedia = {
  id?: number;
  bandId: string;
  fileId: string;
  publicFilePath?: string;
  mediaFile: FileModel;
  totalSeconds: AllowedSeconds;
};

export default BandMedia;
