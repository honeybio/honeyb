# https://devcentral.f5.com/wiki/iControl.System__ConfigSync__upload_file.ashx

import bigsuds
import sys
import base64
import binascii
import io
from pymongo import MongoClient
import gridfs

hostip = sys.argv[1]
uname = sys.argv[2]
upass = sys.argv[3]
remote_file = sys.argv[4]
local_file = sys.argv[5]

b = bigsuds.BIGIP(
    hostname = hostip,
    username = uname,
    password = upass,
)

stream_io = io.open(local_file,'wb')
poll = True
chunk_size = 64*1024
foffset = 0
lines = []

while poll:
    res = b.System.ConfigSync.download_file(file_name = remote_file, chunk_size = chunk_size, file_offset = foffset)
    myData = res.get('return')
    fdata = myData.get('file_data')
    chain_type = myData.get('chain_type')
    lines.append(binascii.a2b_base64(fdata))
    if (chain_type == 'FILE_LAST') or (chain_type == 'FILE_FIRST_AND_LAST'):
        poll = False
    stream_io.writelines(lines)
