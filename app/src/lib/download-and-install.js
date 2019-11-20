import RNFetchBlob from 'rn-fetch-blob'

export default version =>
  RNFetchBlob
    .config({
      addAndroidDownloads : {
        useDownloadManager : true, // <-- this is the only thing required
        notification: false,
        path: RNFetchBlob.fs.dirs.DownloadDir + `/dc-mods-v${version}.apk`,
        title : `Click to install dc-mods-v${version}.apk`,
        mime : 'application/vnd.android.package-archive',
        // Optional, but recommended since android DownloadManager will fail when
        // the url does not contains a file extension, by default the mime type will be text/plain
        mime : 'text/apk',
        description : 'File downloaded by download manager.'
      }
    })
    .fetch('GET', `https://github.com/LokiCoder/destiny-child-tools/releases/download/v${version}/dc-mods-v${version}.apk`)
    .then(res => {
      RNFetchBlob.android.actionViewIntent(res.path(), 'application/vnd.android.package-archive')
    })