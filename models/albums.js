const { v4: uuidv4 } = require('uuid');
const { fugaAlbumsFormatsToOurFormats } = require('../utils/album.utils');
const { toTimestamp } = require('../utils/utils');

const createFugaAlbumFromFormData = albumAssetMetaData => {
  let rawDataAlbumAsset = {};

  rawDataAlbumAsset.name = albumAssetMetaData.name;
  rawDataAlbumAsset.label = albumAssetMetaData.label;
  rawDataAlbumAsset.language = albumAssetMetaData.language;
  rawDataAlbumAsset.catalog_number = albumAssetMetaData.catalog_number;
  rawDataAlbumAsset.release_format_type = albumAssetMetaData.release_format_type;
  rawDataAlbumAsset.c_line_text = albumAssetMetaData.c_line_text;
  rawDataAlbumAsset.p_line_text = albumAssetMetaData.p_line_text;
  rawDataAlbumAsset.c_line_year = albumAssetMetaData.c_line_year;
  rawDataAlbumAsset.p_line_year = albumAssetMetaData.p_line_year;
  rawDataAlbumAsset.genre = albumAssetMetaData.genre;
  rawDataAlbumAsset.artists = JSON.parse(albumAssetMetaData.artists);
  rawDataAlbumAsset.original_release_date = albumAssetMetaData.original_release_date;
  rawDataAlbumAsset.consumer_release_date = albumAssetMetaData.consumer_release_date;
  if (albumAssetMetaData.parental_advisory) rawDataAlbumAsset.parental_advisory = albumAssetMetaData.parental_advisory;
  if (albumAssetMetaData.preorder_date) rawDataAlbumAsset.preorder_date = albumAssetMetaData.preorder_date;
  if (albumAssetMetaData.upc) rawDataAlbumAsset.upc = albumAssetMetaData.upc;
  if (albumAssetMetaData.subgenre) rawDataAlbumAsset.subgenre = albumAssetMetaData.subgenre;
  if (albumAssetMetaData.release_version) rawDataAlbumAsset.release_version = albumAssetMetaData.release_version;
  if (albumAssetMetaData.extra_1) rawDataAlbumAsset.extra_1 = albumAssetMetaData.extra_1;
  if (albumAssetMetaData.extra_2) rawDataAlbumAsset.extra_2 = albumAssetMetaData.extra_2;
  if (albumAssetMetaData.extra_3) rawDataAlbumAsset.extra_3 = albumAssetMetaData.extra_3;
  if (albumAssetMetaData.extra_4) rawDataAlbumAsset.extra_4 = albumAssetMetaData.extra_4;
  if (albumAssetMetaData.extra_5) rawDataAlbumAsset.extra_5 = albumAssetMetaData.extra_5;
  if (albumAssetMetaData.extra_6) rawDataAlbumAsset.extra_6 = albumAssetMetaData.extra_6;
  if (albumAssetMetaData.extra_7) rawDataAlbumAsset.extra_7 = albumAssetMetaData.extra_7;
  return rawDataAlbumAsset;
}

const createFSAlbumFromFugaAlbum = (albumFromFuga, ownerEmail, ownerId, artistId) => {
  let saleAndReleaseDateSplitted = albumFromFuga.consumer_release_date.split('-');

  return {
    fugaId: albumFromFuga.id,
    nombreArtist: albumFromFuga.artists[0].name,
    artistId,
    artistFugaId: albumFromFuga.artists[0].id,
    allOtherArtist: albumFromFuga.artists.slice(1,),
    artistFugaId: albumFromFuga.artists[0].id,
    id: uuidv4(),
    title: albumFromFuga.name,
    labelFugaId: albumFromFuga.label.id,
    label_name: albumFromFuga.label.name,
    languageId: albumFromFuga.language,
    languageName: albumFromFuga.language === "ES" ? "Spanish" : "English",
    format: fugaAlbumsFormatsToOurFormats[albumFromFuga.release_format_type],
    c_line: albumFromFuga.c_line_text,
    p_line: albumFromFuga.p_line_text,
    c_year: albumFromFuga.c_line_year,
    p_year: albumFromFuga.p_line_year,
    genre: albumFromFuga.genre,
    subgenre: albumFromFuga.subgenre,
    year: saleAndReleaseDateSplitted[0],
    month: saleAndReleaseDateSplitted[1] > 9 ? saleAndReleaseDateSplitted[1] : saleAndReleaseDateSplitted[1].slice(1),
    dayOfMonth: saleAndReleaseDateSplitted[2].slice(0, 2),
    upc: albumFromFuga.upc,
    version: albumFromFuga.release_version,
    ownerEmail,
    ownerId,
    lastUpdateTS: toTimestamp(albumFromFuga.added_date),
    whenCreatedTS: toTimestamp(albumFromFuga.added_date),
    imagenUrl: "",
    state: albumFromFuga.state,
    migratedRelease: true,
    preOrder: false,
    preOrderDayOfMonth: "",
    preOrderDate: "",
    preOrderMonth: "",
    preOrderYear: "",
    cover: albumFromFuga.cover_image,
    dsps: [],
    totalAssets: albumFromFuga.total_assets,
  }
}

module.exports = { createFugaAlbumFromFormData, createFSAlbumFromFugaAlbum };