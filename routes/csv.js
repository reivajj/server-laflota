const { readSubscriptionsCsv, readISRCsCsv, readUPCsCsvAndWriteNew, readAndTranscriptUPCsCsvAndDSPsForDelivery, readAndEditAlbumsFromUPCs, readAndEditTracksFromUPCs, filterWpAlbumsByUPCDelivered, tryAnotherDeliveryRound } = require("../csv/csvActions");
var router = require("express-promise-router")();
// var wordlist = require('wordlist-english'); // CommonJS
// var wordsSpanish = require('an-array-of-spanish-words')

router.post('/importSubscriptionsFromLocalCSV', async (_, res, next) => {
  const response = await readSubscriptionsCsv();
  return res.status(200).send({ response });
})

router.post('/importISRCsFromLocalCSV/:csvFileName', async (req, res, next) => {
  const response = await readISRCsCsv(req.params.csvFileName);
  return res.status(200).send({ response });
})

router.post('/addZeroToUpcList', async (_, res, next) => {
  const response = await readUPCsCsvAndWriteNew();
  return res.status(200).send({ response });
})

router.post('/prepare-for-delivery', async (_, res, next) => {
  const response = await readAndTranscriptUPCsCsvAndDSPsForDelivery();
  return res.status(200).send({ response });
})

router.post('/bulk-edit', async (_, res, next) => {
  const response = await readAndEditTracksFromUPCs();
  return res.status(200).send({ response });
})

router.post('/filterWpAlbums', async (_, res, next) => {
  const response = await filterWpAlbumsByUPCDelivered();
  return res.status(200).send({ response });
})

router.post('/anotherDeliveryRound', async (_, res, next) => {
  const response = await tryAnotherDeliveryRound();
  return res.status(200).send({ response });
})

// router.get('/language', async (req, res, next) => {
//   let albumTitleSplitted = req.body.text.split(" ");
//   let englishWords = 0;
//   let spanishWords = 0;
//   albumTitleSplitted.forEach(word => {
//     let wordIsInEnglishDict = wordlist['english'].indexOf(word.toLowerCase()) !== -1;
//     let wordIsInSpanishDict = wordsSpanish.indexOf(word.toLowerCase()) !== -1 || word === 'y';
//     console.log("WORD:", word, "/ Is English: ", wordlist['english'].indexOf(word.toLowerCase()) !== -1);
//     console.log("WORD:", word, "/ Is Spanish: ", wordsSpanish.indexOf(word.toLowerCase()) !== -1 || word === 'y');
//     if (wordIsInEnglishDict) englishWords++;
//     if (wordIsInSpanishDict) spanishWords++;
//   })
//   console.log("COUNT ENGLISH: ", englishWords);
//   console.log("COUNT SPANISH: ", spanishWords);
//   let titleIsInEnglish = spanishWords < englishWords;

//   const response = titleIsInEnglish;
//   return res.status(200).send({ response });
// })



module.exports = router;