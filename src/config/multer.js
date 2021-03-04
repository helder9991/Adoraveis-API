import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import AppError from '../errors/AppError';

const tmpFolder = path.resolve(__dirname, '..', 'assets', 'uploads');
export const animalUploadFolder = path.resolve(tmpFolder, 'animals');
export const logosUploadFolder = path.resolve(tmpFolder, 'logos');

const limits = {
  fileSize: 2 * 1024 * 1024,
};

function fileFilter(req, file, cb) {
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type.', 400));
  }
}

export const animalUpload = {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: animalUploadFolder,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  limits,
  fileFilter,
};

export const logoUpload = {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: logosUploadFolder,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
  limits,
  fileFilter,
};
