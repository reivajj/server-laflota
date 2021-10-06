const createFugaProduct = productMetaData => {
  return {
    name: productMetaData.name,
    label: productMetaData.label,
    catalog_number: productMetaData.catalog_number,
    upc: productMetaData.upc,
    release_format_type: productMetaData.release_format_type,
    c_line_text: productMetaData.c_line_text,
    p_line_text: productMetaData.p_line_text,
    c_line_year: productMetaData.c_line_year,
    p_line_year: productMetaData.p_line_year,
    genre: productMetaData.genre,
    artists: productMetaData.artists
  };
}


module.exports = createFugaProduct;