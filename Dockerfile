
FROM node:16-bullseye-slim

ENV MONGO_VERSION=5.0.18

# Mongodb user setup
#RUN set -eux; \
#	groupadd --gid 999 --system mongodb; \
#	useradd --uid 999 --system --gid mongodb --home-dir /data/db mongodb; \
#	mkdir -p /data/db /data/configdb; \
#	chown -R mongodb:mongodb /data/db /data/configdb

# /var/lib/mongodb
# /var/log/mongodb
#mongodb-org-tools=MONOG_VERSION

# copy repository
#COPY . /opt/secret-hitler

RUN apt-get update && \
    apt-get install -y --no-install-recommends lsb-release git curl gpg gnupg ca-certificates && \
    curl -fsSL https://pgp.mongodb.com/server-5.0.asc | gpg -o /usr/share/keyrings/mongodb-server-5.0.gpg --dearmor && \
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-5.0.gpg] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/5.0 main" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list && \
    apt-get update && \
    # workaround for not having systemctl in container
    ln -s /bin/echo /bin/systemctl && \
    apt-get install -y mongodb-org-server=${MONGO_VERSION}  && \
    echo "mongodb-org-server hold" | dpkg --set-selections && \
    # remove workaround
    rm /bin/systemctl && \
    # Install Redis
    curl -fsSL https://packages.redis.io/gpg | gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/redis.list && \
    apt-get update && \
    apt-get install -y redis && \
    apt-get remove -y gpg curl lsb-release gnupg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt/secret-hitler

#RUN yarn install
   # yarn add mongoose@5.3.4

EXPOSE 8080 
EXPOSE 6379

VOLUME [ "/opt/secret-hitler/data" ]
VOLUME [ "/opt/secret-hitler/logs" ]
VOLUME [WORKDIR]

CMD [ "/bin/bash", "-c", "cd /opt/secret-hitler && yarn install && yarn dev && ls -al && redis-server --daemonize yes && redis-cli ping && yarn dev" ]