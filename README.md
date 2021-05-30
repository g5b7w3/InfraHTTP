# InfraHTTP

## Introduction
Les étapes de ce laboratoires sont séparées dans les différentes branches présente sur ce git. La version la plus complète ce trouve sur la branche "main". Il s'agit d'une version du laboratoire offrant un load balancing capable de fonctionné en mopde "Round-Robin" ou "Sticky-Session". </br></br>

## Step 1: Static HTTP server with apache httpd
Dans cette étape nous devions installé un serveur HTPP qui nous permet d'heberger un site web basique. Le tout dans une image docker.
Pour réaliser cette étape j'ai utilisé [cette image](https://hub.docker.com/_/php) en version 7.2 avec apache. Ensuite je copie le contenu du fichier "content" qui contient mon code html/js/css dans la destination /var/www/html dans mon contenaire avec la commande ```COPY``` dans le Dockerfile. </br></br>
Pour build mon image j'ai utilisé la commande : ```sudo docker build -t res/apache_php .```</br></br>
Pour lancer un container avec cette image j'ai utilisé la commande : ```sudo docker run res/apache_php```</br></br>
Afin de conntrôler le bon fonctionnement de tout cela, je me suis connecter dans mon navigateur sur : localhost</br></br>


## Step 2: Dynamic HTTP server with express.js
Pour cette étape il fallait réaliser un server HTTP capable de renvoyer des données en JSON. Pour cela j'ai utilisé Node.js et express.js. Pour réaliser cette étape j'ai utilisé [cette image](https://hub.docker.com/_/node) en version 14.17. Ensuite je copie le contenu du fichier "src" qui contient les modules node ainsi que mon script js dans /opt/app dans mon contenaire avec la commande ```COPY``` dans le Dockerfile.</br> </br>
Pour build mon image j'ai utilisé la commande : ```sudo docker build -t res/express_students .```</br></br>
Pour lancer un container avec cette image j'ai utilisé la commande : ```sudo docker run res/express_students```</br></br>
Afin de conntrôler le bon fonctionnement de tout cela, je me suis connecter dans mon navigateur sur : localhost/api/students:3000</br></br>

## Step 3: Reverse proxy with apache (static configuration)
Pour cette partie, nous devons installer un reverse proxy. Pour ce faire on utilise la même image de base quuê pour l'étape une. Cependant cette fois on copie le contenu de "conf/" dans /etc/apache2. Ensuite on exécute deux commande, ```RUN a2enmod proxy proxy_http``` et ```RUN a2ensite 000-* 001-*``` qui permette d'activer notre configuration sur le serveur apache lors de son démarage. Le fichier "000-default.conf" est vide, cependant le fichier 001-reverse-proxy.conf contient toute les infos nécessaire au serveur pour la distribution de flux. 
Pour build mon image j'ai utilisé la commande : ```sudo docker build -t res/apache_rp .```</br></br>
Pour lancer un container avec cette image j'ai utilisé la commande : ```sudo docker run res/apache_rp```</br></br>
J'ai ajouter une ligne dans mon fichier local "DNS", ```/etc/hosts/```, afin de définir que l'addresse : ```172.17.0.4``` corresponde a : demo.res.ch. L'addrresse IP correspoond a la 3ème addresse données par docker lors du lancement de contenaire. Et comme pour tester le bon fonctionnement j'ai besoin de mes deux images précédemment crée, cette image et la troisième que je lance. Pour l'instant les addresses IP qui répondent au requête sur ```/``` et ```/api/students``` sont écrites en dur dans le fichier de configuration, ce point sera amélioré par la suite.</br></br>

## Step 4: AJAX requests with JQuery
Pour cette étape nous devions mettre a jour dynamiquement notre site principal. Je me suis fortement inspiré de la vidéo de présentation pour effectuer cette partie. 
</br></br>
Toute les 2 secondes une requête est effectuée. Elle permet de récupéré une liste de ville généré par le script JS qui se trouve dans le contenaire ```res/express_students```.</br></br>
Il a fallut également renseigner, au pieds de la page statique HTML, le chemin d'accès au script JS qui nous permet d'effectuer ces requêtes. Lors de cette étape j'ai également ajouté l'installation de VIM dans mes Dockerfile pour facilité les modifications des fichiers se trouvant à l'intérieur d'un contenaire.</br></br>

## Step 5: Dynamic reverse proxy configuration
Cette partie propose une solution au principal problème de l'étape 3 concernant la configuration des addresses IP. 
</br></br>
Grâce au script php ```config-template```, lors du lancement d'un contenaire, le fichier ```001-reverse-proxy.conf``` va être réecris avec les variables d'environnements passé en paramêtre lors du lancement du contenaire. C'est dans ce fichier qu'était "hard codé" les addresses IP de notre seveur statique et dynamique. Pour lancer le contenaire avec une configuration fonctionnelles il faut maintenant spécifié  le paramètre ```-e``` pour chaque addresses IP. 
</br></br>
Par exemple : ``` sudo docker run -d -e STATIC_APP=172.17.0.2 -e DYNAMIC_APP=172.17.0.4 res/apache_rp``` </br></br>

## Additional steps to get extra points on top of the "base" grade
### Load balancing: multiple server nodes (0.5pt)
Popur le load balancing j'ai utilisé une image de [nginx](https://hub.docker.com/_/nginx). </br></br>

Pour respecté la nomenclature utilisée jusqu'a maintenant, j'ai crée un nouveau dossier dans "docker-images" nommé ```load-balancing```. On y trouve les 2 fichiers nécessaire au fonctionnement du load balancing. </br></br>
Premièrement le Dockerfile permettant la création d'une image et deuxièment le fichier de configuration de NGINX. Le fichier contient une liste d'addresse IP pour chaque service (donc ```/``` et ```/api/students```) disponible sur le quel il peut donc forward les requêtes reçues. </br></br>

Initialement NGINX utilise par défault la méthode "Round-Robin" comme on peut le lire dans la [documentation](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/#method). Dans cette documentation on trouve également une méthode de hash d'addresse IP pour garentir un load-balancing en mode "Sticky-Session". C'est la méthode que j'ai décidé d'implémenter au point suivant.</br></br>

Pour vérifier le bon fonctionnement de cette étape j'ai annalyser les trames réseau en utilisant WireShark. J'ai pu constater que le server était capable de partagé les requêtes entrante vers les différents serveur mis à ça disposition. </br></br>

### Load balancing: round-robin vs sticky sessions (0.5 pt)
Comme dit plus haut j'ai implémenté cette fonctionnalité en utilisant un hash de l'addressse IP ce qui permet de garentir qu'une addresse IP s'addressera au même SRV sauf si ce dernier devenait inaccessible. </br></br>
Pour résaliser cette tâche il m'a suffit de rajouter ```hash $remote_addr;``` dans le fichier de configuration de NGINX et de rebuild mon image pour prendre en compte les modifications.</br></br>

Pour vérifier le bon fonctionnment de cette étape j'ai procédé de la même manière qu'a l'étape précédente mais cette fois j'ai vérifié qu'un client soit toujours renvoyé sur le même serveur.</br></br>

