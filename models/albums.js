const createFugaAlbum = albumMetaData => {
  return {
    name: albumMetaData.name,
    label: albumMetaData.label,
    catalog_number: albumMetaData.catalog_number,
    upc: albumMetaData.upc,
    release_format_type: albumMetaData.release_format_type,
    c_line_text: albumMetaData.c_line_text,
    p_line_text: albumMetaData.p_line_text,
    c_line_year: albumMetaData.c_line_year,
    p_line_year: albumMetaData.p_line_year,
    genre: albumMetaData.genre,
    artists: albumMetaData.artists
  };
}

module.exports = createFugaAlbum;