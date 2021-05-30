# InfraHTTP
## Step 1: Static HTTP server with apache httpd
Dans cette étape nous devions installé un serveur HTPP qui nous permet d'heberger un site web basique. Le tout dans une image docker.
Pour réaliser cette étape j'ai utilisé [cette image](https://hub.docker.com/_/php) en version 7.2 avec apache. Ensuite je copie le contenu du fichier "content" qui contient mon code html/js/css dans la destination /var/www/html dans mon contenaire avec la commande ```COPY``` dans le Dockerfile. </br>
Pour build mon image j'ai utilisé la commande : ```sudo docker build -t res/apache_php .```</br>
Pour lancer un container avec cette image j'ai utilisé la commande : ```sudo docker run res/apache_php```</br>
Afin de conntrôler le bon fonctionnement de tout cela, je me suis connecter dans mon navigateur sur : localhost</br>


## Step 2: Dynamic HTTP server with express.js
Pour cette étape il fallait réaliser un server HTTP capable de renvoyer des données en JSON. Pour cela j'ai utilisé Node.js et express.js. Pour réaliser cette étape j'ai utilisé [cette image](https://hub.docker.com/_/node) en version 14.17. Ensuite je copie le contenu du fichier "src" qui contient les modules node ainsi que mon script js dans /opt/app dans mon contenaire avec la commande ```COPY``` dans le Dockerfile.</br> 
Pour build mon image j'ai utilisé la commande : ```sudo docker build -t res/express_students .```</br>
Pour lancer un container avec cette image j'ai utilisé la commande : ```sudo docker run res/express_students```</br>
Afin de conntrôler le bon fonctionnement de tout cela, je me suis connecter dans mon navigateur sur : localhost/api/students:3000</br>

## Step 3: Reverse proxy with apache (static configuration)
Pour cette partie, nous devons installer un reverse proxy. Pour ce faire on utilise la même image de base quuê pour l'étape une. Cependant cette fois on copie le contenu de "conf/" dans /etc/apache2. Ensuite on exécute deux commande, ```RUN a2enmod proxy proxy_http``` et ```RUN a2ensite 000-* 001-*``` qui permette d'activer notre configuration sur le serveur apache lors de son démarage. Le fichier "000-default.conf" est vide, cependant le fichier 001-reverse-proxy.conf contient toute les infos nécessaire au serveur pour la distribution de flux. 
Pour build mon image j'ai utilisé la commande : ```sudo docker build -t res/apache_rp .```</br>
Pour lancer un container avec cette image j'ai utilisé la commande : ```sudo docker run res/apache_rp```</br>
J'ai ajouter une ligne dans mon fichier local "DNS", ```/etc/hosts/```, afin de définir que l'addresse : ```172.17.0.4``` corresponde a : demo.res.ch. L'addrresse IP correspoond a la 3ème addresse données par docker lors du lancement de contenaire. Et comme pour tester le bon fonctionnement j'ai besoin de mes deux images précédemment crée, cette image et la troisième que je lance. Pour l'instant les addresses IP qui répondent au requête sur ```/``` et ```/api/students``` sont écrites en dur dans le fichier de configuration, ce point sera amélioré par la suite.

## Step 4: AJAX requests with JQuery
Pour cette étape nous devions mettre a jour dynamiquement notre site principal. Je me suis fortement inspiré de la vidéo de présentation pour effectuer cette partie. Toute les 2 secondes une requête est effectuée. Elle permet de récupéré une liste de ville généré par le script JS qui se trouve dans le contenaire ```res/express_students```. Il a fallut également renseigner, au pieds de la page statique HTML, le chemin d'accès au script JS qui nous permet d'effectuer ces requêtes. Lors de cette étape j'ai également ajouté l'installation de VIM dans mes Dockerfile pour facilité les modifications des fichiers se trouvant à l'intérieur d'un contenaire.
## Step 5: Dynamic reverse proxy configuration
Cette partie propose une solution au principal problème de l'étape 3 concernant la configuration des addresses IP. Grâce au script php ```config-template```, lors du lancement d'un contenaire, le fichier ```001-reverse-proxy.conf``` va être réecris avec les variables d'environnements passé en paramêtre lors du lancement du contenaire. C'est dans ce fichier qu'était "hard codé" les addresses IP de notre seveur statique et dynamique. Pour lancer le contenaire avec une configuration fonctionnelles il faut maintenant spécifié  le paramètre ```-e``` pour chaque addresses IP. Par exemple : ``` sudo docker run -d -e STATIC_APP=172.17.0.2 -e DYNAMIC_APP=172.17.0.4 res/apache_rp``` 
## Additional steps to get extra points on top of the "base" grade
