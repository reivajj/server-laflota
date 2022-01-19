const { createFugaTrackAsset } = require('../../models/tracks');
const { createFugaTrackUploadStart } = require('../../models/upload');
const { getAllTracksAssetsFromFuga, uploadTrackAssetToProvider, getTrackAssetByIdFromFuga, uploadTrackFileInAlbumToFuga, updateTrackAssetWithIdFromFuga, getTrackContributorsFromFuga, addContributorToAssetFuga } = require('../../third-party-api/providers/fuga/tracks');
const { getUploadUuid, uploadFile, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { attachTrackAssetInAlbumWithId } = require('./albums');
const FormData = require('form-data');

const getAllTracks = async () => {
  const response = await getAllTracksAssetsFromFuga();
  return response;
}

const getTrackAssetById = async trackAssetId => {
  const response = await getTrackAssetByIdFromFuga(trackAssetId);
  return response;
}

const createTrackAsset = async (trackAssetMetadata) => {
  const rawDataTrackAsset = createFugaTrackAsset(trackAssetMetadata);
  const response = await uploadTrackAssetToProvider(rawDataTrackAsset);
  return response;
}

const startUploadTrack = async uploadStartMetaData => {
  const rawDataUploadStart = createFugaTrackUploadStart(uploadStartMetaData);
  const response = await getUploadUuid(rawDataUploadStart);
  return response;
}

// const uploadTrack = async (trackFileMetaData, trackFile) => {
//   const formDataTrackWithFile = createFugaTrackFileUpload(trackFileMetaData, trackFile);
//   const response = await uploadFile(formDataTrackWithFile);
//   return response;
// }

const updateTrackAssetWithId = async (trackAssetId, trackAssetMetadataToUpdate) => {
  const rawDataTrackAssetToUpdate = createFugaTrackAsset(trackAssetMetadataToUpdate);
  const response = await updateTrackAssetWithIdFromFuga(trackAssetId, rawDataTrackAssetToUpdate);
  return response;
}

const getEnd = (index, chunksize, totalParts, totalSize) => {
  if (index + 1 === totalParts) return totalSize - 1;
  else return (index + 1) * chunksize - 1;
}

const createFugaTrackFileUpload = async (trackFile, trackUploadStartUuid) => {
  let chunksize = 2000000;
  let totalParts = parseInt(trackFile.size / chunksize) + 1;
  let arrayChunks = [...Array(totalParts).keys()];

  const uploadChunks = arrayChunks.map(async chunkIndex => {
    let cutBufferAt = getEnd(chunkIndex, chunksize, totalParts, trackFile.size);
    let startBuffer = chunkIndex * chunksize;

    let chunkFile = {
      fieldname: 'track',
      originalname: `trackChunk-${chunkIndex}.wav`,
      encoding: '7bit',
      mimetype: 'audio/wave',
      buffer: trackFile.buffer.slice(startBuffer, cutBufferAt)
    }

    console.log("Start and End :", { startBuffer, cutBufferAt });
    const formDataTrack = new FormData();
    formDataTrack.append("uuid", trackUploadStartUuid);
    formDataTrack.append("filename", trackFile.originalname);
    formDataTrack.append("totalfilesize", trackFile.size);
    formDataTrack.append("partindex", chunkIndex);
    formDataTrack.append("chunksize", chunksize);
    formDataTrack.append("partbyteoffset", chunksize * chunkIndex);
    formDataTrack.append("totalparts", totalParts);
    formDataTrack.append("file", chunkFile.buffer, chunkFile.originalname);

    console.log("CHUNK FILE :", chunkFile);
    await uploadTrackFileInAlbumToFuga(formDataTrack).catch(error => error);
    return `Chunk ${chunkIndex} uploaded`;
  })

  return Promise.all(uploadChunks).then(result => result).catch(error => console.log(error));
}

const uploadTrackFileInAlbum = async (trackAssetId, trackAssetType, albumId, trackFile) => {
  const rawDataTrackFileUploadStart = createFugaTrackUploadStart({ id: trackAssetId, type: trackAssetType });
  const responseUploadStart = await getUploadUuid(rawDataTrackFileUploadStart);

  const chunksUploadResponse = await createFugaTrackFileUpload(trackFile, responseUploadStart.data.id);
  console.log("PromiseAllResponse: ", chunksUploadResponse);
  const responseFinishUpload = await finishUpload(responseUploadStart.data.id, trackFile);

  const responseAttachTrackInAlbum = await attachTrackAssetInAlbumWithId(albumId, trackAssetId);
  return { responseAttachTrackInAlbum, responseFinishUpload };
}

const uploadTrackAssetWithFile = async (trackAssetMetaData, trackFile) => {
  const responseTrackAssetCreated = await createTrackAsset(trackAssetMetaData);
  const { responseFinishUpload, responseAttachTrackInAlbum } = await uploadTrackFileInAlbum(responseTrackAssetCreated.data.id
    , 'audio', trackAssetMetaData.albumId, trackFile);

  return {
    data: {
      result: responseFinishUpload.data, fugaTrackCreatedInfo: responseAttachTrackInAlbum.data
      , albumId: trackAssetMetaData.albumId
    }
  };
}

// =================================CONTRIBUTORS================================\\


const getTrackContributors = async trackAssetId => {
  const response = await getTrackContributorsFromFuga(trackAssetId);
  return response;
}

const addContributorToAsset = async (trackAssetId, rawDataContributor) => {
  const response = await addContributorToAssetFuga(trackAssetId, rawDataContributor)
  return response;
}

module.exports = {
  getAllTracks, getTrackAssetById, createTrackAsset, startUploadTrack,
  uploadTrackAssetWithFile, updateTrackAssetWithId, getTrackContributors, addContributorToAsset,
}