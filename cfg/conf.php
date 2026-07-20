;<?php http_response_code(403); /*
; Pursuit's PrivateBin configuration.

[main]
name = "Pursuit Secrets"
basepath = "https://pursuit-secrets.onrender.com/"
discussion = false
password = true
fileupload = true
burnafterreadingselected = true
defaultformatter = "plaintext"
sizelimit = 10000000
templateselection = false
template = "bootstrap5"
info = "Powered by PrivateBin 2.0.5."
notice = "Encrypted in your browser. Keep the complete link private."
languageselection = false
qrcode = true
email = false
httpwarning = true
compression = "zlib"

[expire]
default = "1day"

[expire_options]
5min = 300
1hour = 3600
1day = 86400
1week = 604800
1month = 2592000

[formatter_options]
plaintext = "Plain Text"
syntaxhighlighting = "Source Code"
markdown = "Markdown"

[traffic]
limit = 10
header = "X_FORWARDED_FOR"

[purge]
limit = 300
batchsize = 10

[model]
class = Filesystem

[model_options]
dir = PATH "data"
