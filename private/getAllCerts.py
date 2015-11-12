import bigsuds
import sys
import time

# https://devcentral.f5.com/wiki/iControl.Management__KeyCertificate__key_export_to_pem.ashx

# MANAGEMENT_MODE_DEFAULT       0       Management of keys/certs used in SSL profiles.
# MANAGEMENT_MODE_WEBSERVER     1       Management of keys/certs used by the web server.
# MANAGEMENT_MODE_EM    2       Management of keys/certs used by enterprise management
# MANAGEMENT_MODE_IQUERY        3       Management of keys/certs used by GTM's iQuery, gtm directory.
# MANAGEMENT_MODE_IQUERY_BIG3D  4       Management of keys/certs used by GTM's iQuery, big3d directory.

hostip = sys.argv[1]
uname = sys.argv[2]
upass = sys.argv[3]
# whichCerts = [sys.argv[4]]

try:
    b = bigsuds.BIGIP(
        hostname = hostip,
        username = uname,
        password = upass,
    )
except:
    pass

cert_list = b.Management.KeyCertificate.get_key_list('MANAGEMENT_MODE_DEFAULT')
my_list = []
for cert in cert_list:
    my_list.append(cert['key_info']['id'])

pem = b.Management.KeyCertificate.key_export_to_pem('MANAGEMENT_MODE_DEFAULT', my_list)

# print cert_list
for cert in cert_list:
    pem = b.Management.KeyCertificate.key_export_to_pem('MANAGEMENT_MODE_DEFAULT', [cert['key_info']['id']])
    cert['pem'] = pem
    print cert['pem']
#    time.sleep(1)

#print pem


#all_certs = b.Management.KeyCertificate.certificate_export_to_pem('MANAGEMENT_MODE_DEFAULT', my_small_list)

#print all_certs
#for cert in all_certs:
#    print cert
