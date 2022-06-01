const fs = require("fs");

const { uploadAlbumToProvider, getAllAlbumsFromFuga, getAlbumByIdFromFuga, attachTrackAssetInAlbumFuga,
  uploadCoverInAlbumToFuga, changeTrackPositionInAlbumInFUGA, publishAlbumWithIdInFuga, updateAlbumWithIdInFuga,
  deleteAlbumAndAssetsWithIdFromFuga, generateUPCAlbumWithIdInFuga, getAlbumLiveLinksByIdFuga,
  getFugaAlbumCoverImageFUGA, getAlbumByFieldValueFuga } = require('../../third-party-api/providers/fuga/albums');
const { getUploadUuid, finishUpload } = require('../../third-party-api/providers/fuga/upload');
const { createFugaCoverUploadStart, createFugaCoverUpload } = require('../../models/upload');
const { createFugaAlbumFromFormData } = require('../../models/albums');
const { uploadFileByChunks } = require('../../utils/upload.utils');
const { createNoCoverFugaError } = require('../../third-party-api/providers/errors/createFugaErrors');

const getAllAlbums = async urlQuery => {
  const responseGetAllAlbums = await getAllAlbumsFromFuga(urlQuery);
  return responseGetAllAlbums;
}

const getAlbumByFieldValue = async fieldValue => {
  const responseGetAlbum = await getAlbumByFieldValueFuga(fieldValue);
  return responseGetAlbum.data.length > 0 ? responseGetAlbum : { data: "NOT_EXISTS" };
}

const getAlbumById = async albumId => {
  const responseGetAlbum = await getAlbumByIdFromFuga(albumId);
  return responseGetAlbum;
}

const getAlbumLiveLinksById = async albumId => {
  const response = await getAlbumLiveLinksByIdFuga(albumId);
  return response;
}

const createAlbumAsset = async albumFormData => {
  const rawDataAlbum = createFugaAlbumFromFormData(albumFormData);
  const responseUploadAlbum = await uploadAlbumToProvider(rawDataAlbum);
  return responseUploadAlbum;
}

const attachTrackAssetInAlbumWithId = async (albumId, trackId) => {
  const response = await attachTrackAssetInAlbumFuga(albumId, trackId);
  return response;
}

const createCoverImageInAlbum = async (coverFormDataToUpload, coverFile) => {
  if (!coverFile) throw createNoCoverFugaError(coverFile);
  const rawDataCoverUploadStart = createFugaCoverUploadStart(coverFormDataToUpload);
  const responseUploadStart = await getUploadUuid(rawDataCoverUploadStart);

  let mimeType = coverFile.mimetype; let extension = coverFile.originalname.split(".")[coverFile.originalname.split(".").length - 1];
  const chunksUploadResponse = await uploadFileByChunks(coverFile, responseUploadStart.data.id, mimeType, extension, "cover", uploadCoverInAlbumToFuga);
  const responseUploadAlbumCoverFinish = finishUpload(responseUploadStart.data.id, coverFile);

  return responseUploadAlbumCoverFinish;
}

const getFugaAlbumCoverImage = async (albumFugaId, size) => {
  let imageResponse = await getFugaAlbumCoverImageFUGA(albumFugaId, size);
 
  if (!fs.existsSync('./albumImages')) fs.mkdirSync('./albumImages');
  const writer = fs.createWriteStream(`albumImages/${albumFugaId}.png`)

  imageResponse.data.pipe(writer)
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  });
}

const uploadAlbumAssetWithCover = async (albumAssetMetaData, coverFile) => {
  const responseCreateAlbumAsset = await createAlbumAsset(albumAssetMetaData);
  const responseUploadAlbumCoverFinish = await createCoverImageInAlbum({
    type: albumAssetMetaData.typeCover, id: responseCreateAlbumAsset.data.cover_image.id
  }, coverFile);

  return {
    data: { result: responseUploadAlbumCoverFinish.data, albumId: responseCreateAlbumAsset.data.id }
  };
}

const changeTrackPositionInAlbum = async (albumId, trackId, newPosition) => {
  const responseChangeTrackPosition = await changeTrackPositionInAlbumInFUGA(albumId, trackId, newPosition);
  return responseChangeTrackPosition;
}

const publishAlbumWithId = async albumId => {
  const responsePublishAlbum = await publishAlbumWithIdInFuga(albumId);
  return responsePublishAlbum;
}

const updateAlbumWithId = async (albumId, newData) => {
  const responseUpdateAlbum = await updateAlbumWithIdInFuga(albumId, newData);
  return responseUpdateAlbum;
}

const deleteAlbumAndAssetsWithId = async (albumId, deleteAllAssets) => {
  const deleteAllAssetsBoolean = deleteAllAssets === "true";
  const responseDeleteAlbum = await deleteAlbumAndAssetsWithIdFromFuga(albumId, deleteAllAssetsBoolean);
  return responseDeleteAlbum;
}

const checkIfAlbumHasAlreadyUPCErrorAndAct = async (errorBarcode, albumId) => {
  console.log("ERROR BARCODE: ", errorBarcode);
  if (errorBarcode.data.code === "PRODUCT_ALREADY_HAS_UPC" || errorBarcode.data.upc === "DUPLICATE_UPC_CODE") {
    const albumResponse = await getAlbumById(albumId);
    return { data: albumResponse.data.upc };
  }
  else throw createError(400, errorBarcode.data.message, {
    config: { url: "/albums" },
    response: { data: { code: errorBarcode.data.code, upc: errorBarcode.data.upc } }
  });
}


const generateUPCAlbumWithId = async albumId => {
  const responseCreateUPC = await generateUPCAlbumWithIdInFuga(albumId)
    .catch(async error => await checkIfAlbumHasAlreadyUPCErrorAndAct(error.response, albumId));
  return responseCreateUPC;
}

module.exports = {
  getAllAlbums, getAlbumById, createAlbumAsset, attachTrackAssetInAlbumWithId,
  createCoverImageInAlbum, uploadAlbumAssetWithCover, changeTrackPositionInAlbum,
  publishAlbumWithId, updateAlbumWithId, deleteAlbumAndAssetsWithId,
  generateUPCAlbumWithId, getAlbumLiveLinksById, getFugaAlbumCoverImage, getAlbumByFieldValue
};