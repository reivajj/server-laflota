const { uploadLabelToProvider, getAllLabelsFromDashGo } = require('../../third-party-api/providers/dashgo/labels');
const createDashGoLabel = require('../../models/labels');

const getAllLabels = async () => {
  const response = await getAllLabelsFromDashGo();
  return response;
}

const createLabel = async labelMetadata => {
  const labelFormData = createDashGoLabel(labelMetadata);
  const response = await uploadLabelToProvider(labelFormData);

  return response;
}

module.exports = { getAllLabels, createLabel };