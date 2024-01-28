#!/bin/bash

if [ -n "$VNC_PASSWORD" ]; then
    echo -n "$VNC_PASSWORD" > /.password1
    x11vnc -storepasswd $(cat /.password1) /.password2
    chmod 400 /.password*
    sed -i 's/^command=x11vnc.*/& -rfbauth \/.password2/' /etc/supervisor/conf.d/supervisord.conf
    export VNC_PASSWORD=
fi

if [ -n "$RESOLUTION" ]; then
    sed -i "s/1024x768/$RESOLUTION/" /usr/local/bin/xvfb.sh
fi

USER=${USER:-root}
if [ "$USER" != "root" ]; then
    echo "* enable custom user: $USER"
    useradd --create-home --shell /bin/bash --user-group --groups adm,sudo $USER
    if [ -z "$PASSWORD" ]; then
        echo "  set default password to \"ubuntu\""
        PASSWORD=ubuntu
    fi
    HOME=/home/$USER
    echo "$USER:$PASSWORD" | chpasswd
    # cp -r /root/{.config,.gtkrc-2.0,.asoundrc} ${HOME}
    chown -R $USER:$USER ${HOME}
    #[ -d "/dev/snd" ] && chgrp -R adm /dev/snd
fi

#FLASK_APP=$HOME/app.py flask run --host=0.0.0.0 &


# Start Flask server that will receive screen resolution
##python3 -m flask run -h 0.0.0.0 &
#python3 $HOME/app.py &
#export FLASK_PID=$!

# Function to kill Flask server and cleanup
#function cleanup {
#    echo "Cleaning up..."
#    kill $FLASK_PID
#    wait $FLASK_PID
#}

### exec gunicorn -w 4 -b 0.0.0.0:6079 app:app --log-level debug &

# Create the Templates directory
#RUN mkdir -p $HOME/Templates

exec gunicorn \
    -w 4 -b 0.0.0.0:6079 app:app \
    --log-level debug \
    --access-logfile - \
    --access-logformat '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"' \
    &

exec  /usr/bin/supervisord  -n -c /etc/supervisor/supervisord.conf
