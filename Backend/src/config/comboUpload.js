const MAX_COMBO_IMAGES = 20;
const MAX_COMBO_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const getCanonicalImageExtension = (file) => {
  const mimeType = String(file?.mimetype || '').toLowerCase();
  if (mimeType === 'image/png') return '.png';
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') return '.jpeg';

  const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
  if (['png'].includes(extension)) return '.png';
  if (['jpg', 'jpeg'].includes(extension)) return '.jpeg';
  return '.jpeg';
};

const isAllowedComboImage = (file) => {
  const mimeType = String(file?.mimetype || '').toLowerCase();
  const extension = String(file?.originalname || '').split('.').pop()?.toLowerCase();
  return ['image/jpeg', 'image/jpg', 'image/png'].includes(mimeType) || ['jpg', 'jpeg', 'png'].includes(extension);
};

module.exports = {
  MAX_COMBO_IMAGES,
  MAX_COMBO_IMAGE_SIZE_BYTES,
  getCanonicalImageExtension,
  isAllowedComboImage,
};
