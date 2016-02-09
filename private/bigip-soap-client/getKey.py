import bigsuds
import sys

# https://devcentral.f5.com/wiki/iControl.Management__KeyCertificate__key_export_to_pem.ashx

# MANAGEMENT_MODE_DEFAULT       0       Management of keys/certs used in SSL profiles.
# MANAGEMENT_MODE_WEBSERVER     1       Management of keys/certs used by the web server.
# MANAGEMENT_MODE_EM    2       Management of keys/certs used by enterprise management
# MANAGEMENT_MODE_IQUERY        3       Management of keys/certs used by GTM's iQuery, gtm directory.
# MANAGEMENT_MODE_IQUERY_BIG3D  4       Management of keys/certs used by GTM's iQuery, big3d directory.


hostip = sys.argv[1]
uname = sys.argv[2]
upass = sys.argv[3]
objectName = [sys.argv[4]]

try:
    b = bigsuds.BIGIP(
        hostname = hostip,
        username = uname,
        password = upass,
    )
except:
    pass


#object_list = b.Management.KeyCertificate.get_key_list_v2('MANAGEMENT_MODE_DEFAULT')
obj_list = b.Management.KeyCertificate.key_export_to_pem('MANAGEMENT_MODE_DEFAULT', objectName)

for obj in obj_list:
    print obj
