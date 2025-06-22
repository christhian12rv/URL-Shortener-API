#!/bin/bash
sudo chown root:root filebeat.docker.yml
sudo chmod 600 filebeat.docker.yml

sudo chown root:root metricbeat.docker.yml
sudo chmod 600 metricbeat.docker.yml

docker compose up
