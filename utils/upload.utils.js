const FormData = require('form-data');

const getEndOfChunk = (index, chunksize, totalParts, totalSize) => {
  if (index + 1 === totalParts) return totalSize - 1;
  else return (index + 1) * chunksize - 1;
}

// REVEER: Pasar a FOR no con PROMISES... Chequear que no se pierde tanta eficacia.
// Realmente dudo que haya un problema aca. El RETRY deberia poder solucionar algo.
// const uploadFileByChunks = async (file, coverUploadStartUuid, mimeType, fileExtension, fileName, uploadFunction) => {
//   let chunksize = 2000000;
//   let totalParts = parseInt(file.size / chunksize) + 1;
//   let arrayChunks = [...Array(totalParts).keys()];
//   console.time("test upload");

//   for (chunkIndex of arrayChunks) {
//     let cutBufferAt = getEndOfChunk(chunkIndex, chunksize, totalParts, file.size);
//     let startBuffer = chunkIndex * chunksize;

//     let chunkFile = {
//       fieldname: fileName,
//       originalname: `${fileName}-${chunkIndex}.${fileExtension}`,
//       mimetype: mimeType,
//       buffer: file.buffer.slice(startBuffer, cutBufferAt)
//     }

//     const formDataFile = new FormData();
//     formDataFile.append("uuid", coverUploadStartUuid);
//     formDataFile.append("filename", file.originalname);
//     formDataFile.append("totalfilesize", file.size);
//     formDataFile.append("partindex", chunkIndex);
//     formDataFile.append("chunksize", chunksize);
//     formDataFile.append("partbyteoffset", chunksize * chunkIndex);
//     formDataFile.append("totalparts", totalParts);
//     formDataFile.append("file", chunkFile.buffer, chunkFile.originalname);

//     await uploadFunction(formDataFile).catch(error => {
//       console.log("ERROR: ", error);
//       return error;
//     });
//     console.log("CHUNK INDEX: ", chunkIndex)
//   }

//   console.timeEnd("test upload");
// }


const uploadFileByChunks = async (file, coverUploadStartUuid, mimeType, fileExtension, fileName, uploadFunction) => {
  let oneMB = 1048576;  
  let chunksize = fileExtension === "jpg" ? 6 * oneMB : 2 * oneMB;
  let totalParts = parseInt(file.size / chunksize) + 1;
  let arrayChunks = [...Array(totalParts).keys()];
  console.time("test upload");
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
    console.log("CHUNK INDEX: ", chunkIndex)
    return `Chunk ${chunkIndex} uploaded`;
  })

  return Promise.all(uploadChunks).then(result => {
    console.timeEnd("test upload");
    return result;
  }).catch(error => error);
}

module.exports = { uploadFileByChunks }