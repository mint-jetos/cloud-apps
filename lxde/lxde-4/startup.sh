#!/bin/bash

if [ -n "$VNC_PASSWORD" ]; then
    echo -n "$VNC_PASSWORD" > /.password1
    x11vnc -storepasswd $(cat /.password1) /.password2
    chmod 400 /.password*
    sed -i 's/^command=x11vnc.*/& -rfbauth \/.password2/' /etc/supervisor/conf.d/supervisord.conf
    export VNC_PASSWORD=
fi

echo '#!/bin/sh' | sudo tee /usr/local/bin/xvfb.sh
echo 'exec /usr/bin/Xvfb :1 -screen 0 1366x651x24' | sudo tee -a /usr/local/bin/xvfb.sh
sudo chmod +x /usr/local/bin/xvfb.sh
if [ -n "$RESOLUTION" ]; then
    sed -i "s/1366x651/$RESOLUTION/" /usr/local/bin/xvfb.sh
    echo "  Set custom screen resolution to $RESOLUTION x24"
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

exec  /usr/bin/supervisord  -n -c /etc/supervisor/supervisord.conf
