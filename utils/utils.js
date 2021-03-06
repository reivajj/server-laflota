const possibleAlbumStates = ['PENDING', 'PUBLISHED', 'DELIVERED', 'DELETED', 'REJECTED', 'TO_BE_ACCEPTED'];

const ACTIVE = "active";
const UNSUBSCRIBED = "unsubscribed";
const DELETED = "deleted";
const WAITING_PAYMENT = "waiting_payment";
const UNSUBSCRIBED_PENDING = "unsubscribed_pending";
const PENDING = "pending";
const MIGRATED = "was_migrated";

const deleteWeirdCharacters = text => {
  return text.normalize('NFD')
    .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2")
    .normalize();
}

const toTimestamp = (strDate) => {
  return Date.parse(strDate);
}

const uniqBy = (a, key) => {
  return [
    ...new Map(
      a.map(x => [x[`${key}`], x])
    ).values()
  ]
}

module.exports = {
  possibleAlbumStates, MIGRATED, ACTIVE, UNSUBSCRIBED, DELETED, WAITING_PAYMENT, UNSUBSCRIBED_PENDING, PENDING,
  deleteWeirdCharacters, toTimestamp, uniqBy
};