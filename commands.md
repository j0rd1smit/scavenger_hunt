
build docker
```
docker build -t j0rd1smit/treasure_trails .
docker push j0rd1smit/treasure_trails
```

update server
```
docker rm treasure_trails --force
docker pull j0rd1smit/treasure_trails
docker run --name=treasure_trails -p 80:80 -p 443:443 --volume="/root/dehydrated/certs/treasure-trails.duckdns.org/:/usr/src/app/data/" -e cert=data/cert.pem -e key=data/privkey.pem j0rd1smit/treasure_trails
```