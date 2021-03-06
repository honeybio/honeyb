import bigsuds
import sys

# https://devcentral.f5.com/wiki/iControl.Management__KeyCertificate__key_import_from_pem.ashx

# MANAGEMENT_MODE_DEFAULT       0       Management of keys/certs used in SSL profiles.
# MANAGEMENT_MODE_WEBSERVER     1       Management of keys/certs used by the web server.
# MANAGEMENT_MODE_EM    2       Management of keys/certs used by enterprise management
# MANAGEMENT_MODE_IQUERY        3       Management of keys/certs used by GTM's iQuery, gtm directory.
# MANAGEMENT_MODE_IQUERY_BIG3D  4       Management of keys/certs used by GTM's iQuery, big3d directory.


hostip = sys.argv[1]
uname = sys.argv[2]
upass = sys.argv[3]
objectName = [sys.argv[4]]

overwrite = True

if len(sys.argv) > 5:
    if sys.argv[5] == 1:
        overwrite = True

pemData = ''
for line in sys.stdin:
    pemData += line

try:
    b = bigsuds.BIGIP(
        hostname = hostip,
        username = uname,
        password = upass,
    )
except:
    pass

# Strange behavior where it appears you need to prime the SOAP api to send keys
try:
    b.Management.KeyCertificate.key_import_from_pem('MANAGEMENT_MODE_DEFAULT', [objectName], [pemData], overwrite)
except:
    pass
#for obj in object_list:
#    print obj
