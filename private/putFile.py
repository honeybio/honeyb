# https://devcentral.f5.com/wiki/iControl.System__ConfigSync__upload_file.ashx

import bigsuds
import sys
import base64
import binascii
import io

#System::ConfigSync::download_file
#FileTransferContext download_file(
#    in String file_name,
#    in long chunk_size,
#    inout long file_offset
#);

#file_name	String	The name of the file to be retrieved from the device. Length limit: 255.
#chunk_size	long	The chunk/block size of the file data to read from the device.
#file_offset	long	The file offset that indicates where to read the next chunk of file data from.

def send_file(obj, local_file):
    import io, base64
    ctx = obj.System.ConfigSync.typefactory.create(
                           'System.ConfigSync.FileTransferContext')
    poll = True
    chunk_size = 64*768
    ctx.chain_type = 'FILE_FIRST'
    tsent = 0
    try:
        f = io.open(local_file, 'rb')
    except IOError, e:
        print >> sys.stderr, e
        sys.exit(1)
    while poll:
        fdata = f.read(chunk_size)
        if len(fdata) != chunk_size:
            if tsent == 0:
                ctx.chain_type = 'FILE_FIRST_AND_LAST'
            else:
                ctx.chain_type = 'FILE_LAST'
            poll = False
        ctx.file_data = base64.b64encode(fdata)
        obj.System.ConfigSync.upload_configuration(local_file, ctx)
        tsent += 1
        ctx.chain_type = 'FILE_MIDDLE'

hostip = sys.argv[1]
uname = sys.argv[2]
upass = sys.argv[3]
fileName = [sys.argv[4]]
locFile = [sys.argv[5]]

try:
    b = bigsuds.BIGIP(
                        hostname = hostip,
                        username = uname,
                        password = upass,
                        )
except:
    pass

pc_downloader(b,fileName,locFile)
