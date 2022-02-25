const FormData = require('form-data');

const getEndOfChunk = (index, chunksize, totalParts, totalSize) => {
  if (index + 1 === totalParts) return totalSize - 1;
  else return (index + 1) * chunksize - 1;
}

const uploadFileByChunks = async (file, coverUploadStartUuid, mimeType, fileExtension, fileName, uploadFunction) => {
  let chunksize = 2000000;
  let totalParts = parseInt(file.size / chunksize) + 1;
  let arrayChunks = [...Array(totalParts).keys()];

  const uploadChunks = arrayChunks.map(async chunkIndex => {
    let cutBufferAt = getEndOfChunk(chunkIndex, chunksize, totalParts, file.size);
    let startBuffer = chunkIndex * chunksize;

    let chunkFile = {
      fieldname: fileName,
      originalname: `${fileName}-${chunkIndex}.${fileExtension}`,
      mimetype: mimeType,
      buffer: file.buffer.slice(startBuffer, cutBufferAt)
    }

    const formDataFile = new FormData();
    formDataFile.append("uuid", coverUploadStartUuid);
    formDataFile.append("filename", file.originalname);
    formDataFile.append("totalfilesize", file.size);
    formDataFile.append("partindex", chunkIndex);
    formDataFile.append("chunksize", chunksize);
    formDataFile.append("partbyteoffset", chunksize * chunkIndex);
    formDataFile.append("totalparts", totalParts);
    formDataFile.append("file", chunkFile.buffer, chunkFile.originalname);

    await uploadFunction(formDataFile).catch(error => error);
    return `Chunk ${chunkIndex} uploaded`;
  })

  return Promise.all(uploadChunks).then(result => result).catch(error => console.log(error));
}

module.exports = { uploadFileByChunks }