const dfSaleTypeToAll = dgProductType => {
  const reducer = {
    "T": "Download",
    "S": "Stream",
    "A": "Download"
  }
  return reducer[dgProductType] || "Stream";
}

const dgStoreNameToAll = dgStore => {
  const reducer = {
    "Amazon JP": "Amazon",
    "Youtube Red": "Youtube Music",
    "Youtube Premium": "Youtube Music",
    "YT Audio Tier": "Youtube Music",
    "Youtube Ad": "Youtube Ad Supported",
    "Youtube AD": "Youtube Ad Supported",
    "Youtube Adj": "Youtube Ad Supported",
    "YT Adj Claim": "Youtube Ad Supported",
    "NetEase": "Netease Cloud Music",
    "Facebook - AL Consumption": "Facebook Audio Library",
    "Facebook - UGC Consumption": "Facebook Fingerprinting",
    "Facebook - Adj - AL Consumption": "Facebook Audio Library",
    "Facebook - Adj - UGC Consumption": "Facebook Fingerprinting",
    "Tik Tok Douyin": "TikTok",
    "Saavn": "JioSaavn",
    "Spotify Discovery Mode": "Spotify",
    "Medianet - GTL subscription catalog": "Medianet",
    "Medianet - Keefe-AC: Access Corrections fka Dynamic Media": "Medianet",
    "Medianet - GTL subscription catalog": "Medianet",
    "Medianet - Keefe-ATG: Advanced Technologies Group": "Medianet",
    "Medianet - GTL": "Medianet",
    "Medianet - Securus/JPay permanent downloads catalog": "Medianet",
    "Medianet - Securus": "Medianet"
  }
  return reducer[dgStore] || dgStore;
}

const dkStoreNameToAll = dgStore => {
  const reducer = {
    "Amazon JP": "Amazon",
    "Youtube Red": "Youtube (DK)",
    "Youtube": "Youtube (DK)",
    "Google Play All Access": "Google Music (DK)",
    "Google Play": "Google Music (DK)",
    "Groove (Streaming)": "Groove (DK)",
    "Groove (Downloads)": "Groove (DK)", 
    "iHeart Radio": "iHeart Radio US",
  }
  return reducer[dgStore] || dgStore;
}

module.exports = { dgStoreNameToAll, dfSaleTypeToAll, dkStoreNameToAll };