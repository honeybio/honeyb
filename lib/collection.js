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
  stores: [new FS.Store.FileSystem("images")]
});

Tmpfiles = new FS.Collection("db_tempfiles", {
  stores: [new FS.Store.FileSystem("tempfiles")]
});
