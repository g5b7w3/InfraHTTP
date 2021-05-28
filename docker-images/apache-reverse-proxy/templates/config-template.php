<?php
$dynmaic_app = getenv('DYNAMIC_APP');
$static_app = getenv('STATIC_APP');
?>

                                      
<VirtualHost *:80>

ServerName demo.res.ch

ProxyPass '/api/students/' 'http://<?php print "$dynmaic_app"?>/'
ProxyPassReverse '/api/students/' 'http://<?php print "$dynmaic_app"?>/'

ProxyPass '/' 'http://<?php print "$static_app"?>/'
ProxyPassReverse '/' 'http://<?php print "$static_app"?>/'


</VirtualHost>
