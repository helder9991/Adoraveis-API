import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

export const compressAndResize = async (size, files, uploadTo) => {
  const filesName = await Promise.all(
    files.map(async ({ path: imagePath, filename }) => {
      const fileName = `${new Date().getTime()}-${filename}`.replace(
        /(\s)/g, // get all empty space
        '-',
      );
      await sharp(imagePath)
        .resize(size[0], size[1])
        .toFile(path.join(uploadTo, fileName));

      await fs.promises.unlink(imagePath); // delete saved photo

      return fileName;
    }),
  );

  return filesName;
};

export default {
  compressAndResize,
};
