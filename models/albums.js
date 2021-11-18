const createFugaAlbumFromFormData = albumAssetMetaData => {
  let rawDataAlbumAsset = {};
  rawDataAlbumAsset.artists = JSON.parse(albumAssetMetaData.artists);
  rawDataAlbumAsset.name = albumAssetMetaData.name;
  rawDataAlbumAsset.label = albumAssetMetaData.label;
  rawDataAlbumAsset.catalog_number = albumAssetMetaData.catalog_number;
  rawDataAlbumAsset.release_format_type = albumAssetMetaData.release_format_type;
  rawDataAlbumAsset.c_line_text = albumAssetMetaData.c_line_text;
  rawDataAlbumAsset.p_line_text = albumAssetMetaData.p_line_text;
  rawDataAlbumAsset.c_line_year = albumAssetMetaData.c_line_year;
  rawDataAlbumAsset.p_line_year = albumAssetMetaData.p_line_year;
  rawDataAlbumAsset.genre = albumAssetMetaData.genre;
  rawDataAlbumAsset.original_release_date = albumAssetMetaData.original_release_date;
  rawDataAlbumAsset.consumer_release_date = albumAssetMetaData.consumer_release_date;
  if (albumAssetMetaData.upc) rawDataAlbumAsset.upc = albumAssetMetaData.upc;
 
  return rawDataAlbumAsset;
}

module.exports = { createFugaAlbumFromFormData };