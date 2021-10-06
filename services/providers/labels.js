const { uploadLabelToProvider, getAllLabelsFromFuga } = require('../../third-party-api/providers/fuga/labels');
const createFugaLabel = require('../../models/labels');

const getAllLabels = async () => {
  const response = await getAllLabelsFromFuga();
  return response;
}

const createLabel = async labelMetadata => {
  const rawDataLabel = createFugaLabel(labelMetadata);
  const response = await uploadLabelToProvider(rawDataLabel);

  return response;
}

module.exports = { getAllLabels, createLabel };