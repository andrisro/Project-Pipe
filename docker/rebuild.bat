docker build -t projectpipe .
docker run -it --rm --name gvd -p 8080:8080 projectpipe 