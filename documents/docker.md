# Environnement de Développement

```sh

# create database file
sqlite3 var/database/bdd.db < var/database/schema.sql

# Permission
chmod o+w "./."
chmod o+w "./bdd.db"

# stop and clean
docker-compose down -v

# Start
docker-compose up -d

# log looking
docker-compose logs -f composer

docker-compose exec backend sh

```
