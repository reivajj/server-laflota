import axiosInstance from '../../../config/axiosConfig.js';

const { get, post } = axiosInstance;

export const getAllTracksFromDashGo = async () => {
  const response = await get('/tracks');

  if (!response.data) throw createError(400, 'Error al buscar los Tracks');
  return response;
}

export const uploadTrackToAlbumToProvider = async formDataTrack => {
  const response = await post('/tracks', formDataTrack, {
    headers: { ...formDataTrack.getHeaders() }
  });

  if (!response.data) throw createError(400, 'Error al subir un track al Album en DashGo', { dataResponse: response, formData: formDataTrack });
  return response;
}

