const admin = require('firebase-admin');
const firebaseApp = require('../loaders/firebase');

// Firebase App lo necesito aca..
const dbFS = admin.firestore();

const batchActions = async (docRefs, setOrDeleteOrUpdate, elementsToBatch, totalFieldToUpdate, primaryCollectionTarget, batchSize) => {
  let batch = dbFS.batch();
  let counter = 0;
  let totalCounter = 0;
  const promises = [];

  elementsToBatch.forEach((elem, index) => {

    if (setOrDeleteOrUpdate === "set") batch.set(docRefs[index], { ...elem });
    if (setOrDeleteOrUpdate === "delete") batch.delete(docRefs[index]);
    if (setOrDeleteOrUpdate === "update") batch.update(docRefs[index], { ...elem });

    counter++;

    if (counter >= batchSize) {
      console.log(`Committing batch of ${counter}`);
      promises.push(batch.commit());
      totalCounter += counter;
      counter = 0;
      batch = dbFS.batch();
    }

  })

  if (counter) {
    console.log(`Committing batch of ${counter}`);
    promises.push(batch.commit());
    totalCounter += counter;
  }
  await Promise.all(promises).catch(error => error);

  if (setOrDeleteOrUpdate === "set") await dbFS.collection(primaryCollectionTarget).doc("stats")
    .update({ [`${totalFieldToUpdate}`]: admin.firestore.FieldValue.increment(totalCounter) });

  if (setOrDeleteOrUpdate === "delete") await dbFS.collection(primaryCollectionTarget).doc("stats")
    .update({ [`${totalFieldToUpdate}`]: admin.firestore.FieldValue.increment(- totalCounter) });

  console.log(`Committed total of ${totalCounter}`);

  return `Total ${setOrDeleteOrUpdate}s ${totalCounter}`;
}

module.exports = { batchActions }