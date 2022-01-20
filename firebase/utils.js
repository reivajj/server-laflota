const admin = require('firebase-admin');
const firebaseApp = require('../loaders/firebase');

// Firebase App lo necesito aca..
const dbFS = admin.firestore();

const batchActions = async (docRefs, setOrDeleteOrUpdate, elementsToBatch, totalFieldToUpdate, primaryCollectionTarget, batchSize) => {
  let batch = dbFS.batch();
  let counter = 0;
  let totalCounter = 0;
  const promises = [];

  for (const elem of elementsToBatch) {

    docRefs.forEach(docRef => {
      if (setOrDeleteOrUpdate === "set") batch.set(docRef, { ...elem });
      if (setOrDeleteOrUpdate === "delete") batch.delete(docRef);
      if (setOrDeleteOrUpdate === "update") batch.update(docRef, { ...elem });
    })

    counter++;

    if (counter >= batchSize) {
      console.log(`Committing batch of ${counter}`);
      promises.push(batch.commit());
      totalCounter += counter;
      counter = 0;
      batch = dbFS.batch();
    }
  }

  if (counter) {
    console.log(`Committing batch of ${counter}`);
    promises.push(batch.commit());
    totalCounter += counter;
  }
  await Promise.all(promises).catch(error => error);

  if (setOrDeleteOrUpdate === "set") dbFS.collection(primaryCollectionTarget).doc("stats")
    .update({ [`${totalFieldToUpdate}`]: admin.firestore.FieldValue.increment(totalCounter) });

  if (setOrDeleteOrUpdate === "delete") dbFS.collection(primaryCollectionTarget).doc("stats")
    .update({ [`${totalFieldToUpdate}`]: admin.firestore.FieldValue.increment(- totalCounter) });

  console.log(`Committed total of ${totalCounter}`);

  return `Total ${setOrDeleteOrUpdate}s ${totalCounter}`;
}

module.exports = { batchActions }