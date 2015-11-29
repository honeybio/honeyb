Archives = new FS.Collection("fs_archives", {
  stores: [new FS.Store.GridFS("archives")]
});

Pkifiles = new FS.Collection("fs_pkifiles", {
  stores: [new FS.Store.GridFS("pkifiles")]
});

Asmpolicyfile = new FS.Collection("fs_asmpolicyfile", {
  stores: [new FS.Store.GridFS("asmpolicy")]
});

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images",{
    beforeWrite:function(fileObj){
      return {
            extension: 'iso',
            type: 'application/octet-stream'
          };
    },
    //transformWrite:function(fileObj, readStream, writeStream){
      // MD5 Sum
    //     gm(readStream).resize(400).stream('PNG').pipe(writeStream); //resize depends your needs
    //}
  })]
});
