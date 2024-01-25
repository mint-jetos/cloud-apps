#!/bin/bash

# Enable extended globbing
shopt -s extglob

# Get the current timestamp
timestamp=$(date +"%Y%m%d-%H%M%S")

# Create backup folder
mkdir -p "./backup/${timestamp}"
echo "Backup folder created: ./backup/${timestamp}"

# Copy all files and subdirectories (excluding backup folder) to the backup folder
cp -r !(backup*) "./backup/${timestamp}/"


#       find [.] -type f -exec sed -i 's|from_string|to_string|g' {} \;
#       find [.] -name '???-?????' -type f -mmin +1440;
#       find [.] -name '???-?????' -type f -mmin +1440 -exec rm {} \;
#       rm -if ???-*
#       sudo ssh  -L 5000:localhost:5000 -i [sshkey.pem] ubuntu@aa.bb.cc.dd

# docker build -t flaskpostit .
# docker run -d -p 7082:7080 flaskpostit
# here 7082 is host machine port that should be opened. and 7080 is gunicorn por
