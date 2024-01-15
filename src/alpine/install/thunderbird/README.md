<!DOCTYPE html>
<html>
   <head>
      <title>Supervisord Configuration Explanation</title>
      <style>
         body {
         font-family: Arial, sans-serif;
         }
         h1, h2 {
         color: #333;
         }
         pre {
         background-color: #f0f0f0;
         padding: 10px;
         }
      </style>
   </head>
   <body>
      <h1>Supervisord Configuration Explanation</h1>
      <p>This is a configuration file for <strong>supervisord</strong>, a process control system. It allows you to monitor and control a number of processes on UNIX-like operating systems.</p>
      <h2>[supervisord]</h2>
      <p>This section contains global options for the supervisord process.</p>
      <pre>
[supervisord]
nodaemon=true
pidfile=/tmp/supervisord.pid
logfile=/dev/fd/1
logfile_maxbytes=0
    </pre>
      <ul>
         <li><strong>nodaemon=true</strong>: This runs supervisord in the foreground. It means supervisord will not daemonize itself and will run in the foreground.</li>
         <li><strong>pidfile=/tmp/supervisord.pid</strong>: This is the location where the supervisord process ID will be written. It's used by other programs to find out the PID of the running supervisord process.</li>
         <li><strong>logfile=/dev/fd/1</strong>: This is the location of the supervisord log file. <code>/dev/fd/1</code> is a link to the standard output, so log messages will be sent to the standard output. This is useful when running inside a Docker container.</li>
         <li><strong>logfile_maxbytes=0</strong>: This sets the maximum size of the logfile before it's rotated to 0, which means the logfile will not be rotated. This is useful when you want to handle log rotation outside of supervisord, for example, with a system-wide log rotation service.</li>
      </ul>
      <h2>[program:x11]</h2>
      <p>This section defines the X11 program that supervisord should manage.</p>
      <pre>
[program:x11]
priority=0
user=thunderbird
command=/usr/bin/Xvnc -desktop "Thunderbird" -localhost -rfbport 5900 \
-SecurityTypes VncAuth -PasswordFile /thunderbird/.vnc/passwd -AlwaysShared \
-AcceptKeyEvents -AcceptPointerEvents -AcceptSetDesktopSize -SendCutText \
-AcceptCutText :0
autorestart=true
stdout_logfile=/dev/fd/1
stdout_logfile_maxbytes=0
redirect_stderr=true true
    </pre>
      <ul>
         <li><strong>priority=0</strong>: This determines the order in which programs are started and shut down. Lower numbers have higher priority. This program will be started first and shut down last.</li>
         <li><strong>user=thunderbird</strong>: This is the user that the program will be run as. The program will have the same permissions as this user.</li>
         <li><strong>command</strong>: This is the command that will be run to start the program. In this case, it starts the Xvnc server with several options.</li>
         <li><strong>autorestart=true</strong>: This tells supervisord to automatically restart the program if it exits. If the Xvnc server crashes or is killed, supervisord will automatically start a new instance.</li>
         <li><strong>stdout_logfile=/dev/fd/1</strong>: This is the location where the program's standard output will be written. Again, <code>/dev/fd/1</code> is a link to the standard output.</li>
         <li><strong>stdout_logfile_maxbytes=0</strong>: This sets the maximum size of the stdout logfile before it's rotated to 0, which means the logfile will not be rotated.</li>
         <li><strong>redirect_stderr=true</strong>: This tells supervisord to redirect the stderr to the stdout logfile. This means that both standard output and standard error from the program will be written to the same logfile.</li>
      </ul>
      <h2>[program:novnc]</h2>
      <p>This section defines the noVNC program that supervisord should manage.</p>
      <pre>
[program:novnc]
priority=0
command=/usr/local/novnc/utils/novnc_proxy --vnc localhost:5900
autorestart=true
stdout_logfile=/dev/fd/1
stdout_logfile_maxbytes=0
redirect_stderr=true
    </pre>
      <ul>
         <li><strong>priority=0</strong>: This determines the order in which programs are started and shut down. Lower numbers have higher priority. This program will be started first and shut down last.</li>
         <li><strong>command</strong>: This is the command that will be run to start the program. In this case, it starts the noVNC proxy with the option to connect to a VNC server running on localhost at port 5900.</li>
         <li><strong>autorestart=true</strong>: This tells supervisord to automatically restart the program if it exits. If the noVNC proxy crashes or is killed, supervisord will automatically start a new instance.</li>
         <li><strong>stdout_logfile=/dev/fd/1</strong>: This is the location where the program's standard output will be written. Again, <code>/dev/fd/1</code> is a link to the standard output.</li>
         <li><strong>stdout_logfile_maxbytes=0</strong>: This sets the maximum size of the stdout logfile before it's rotated to 0, which means the logfile will not be rotated.</li>
         <li><strong>redirect_stderr=true</strong>: This tells supervisord to redirect the stderr to the stdout logfile. This means that both standard output and standard error from the program will be written to the same logfile.</li>
      </ul>
      <h2>[program:openbox]</h2>
      <p>This section defines the Openbox program that supervisord should manage.</p>
      <pre>
[program:openbox]
priority=1
command=/usr/bin/openbox
environment=DISPLAY=:0
autorestart=true
stdout_logfile=/dev/fd/1
stdout_logfile_maxbytes=0
redirect_stderr=true
    </pre>
      <ul>
         <li><strong>priority=1</strong>: This determines the order in which programs are started and shut down. Lower numbers have higher priority. This program will be started after all programs with a lower priority number and shut down before them.</li>
         <li><strong>command</strong>: This is the command that will be run to start the program. In this case, it starts the Openbox window manager.</li>
         <li><strong>environment=DISPLAY=:0</strong>: This sets the DISPLAY environment variable for the program. This tells the program which X display it should connect to.</li>
         <li><strong>autorestart=true</strong>: This tells supervisord to automatically restart the program if it exits. If Openbox crashes or is killed, supervisord will automatically start a new instance.</li>
         <li><strong>stdout_logfile=/dev/fd/1</strong>: This is the location where the program's standard output will be written. Again, <code>/dev/fd/1</code> is a link to the standard output.</li>
         <li><strong>stdout_logfile_maxbytes=0</strong>: This sets the maximum size of the stdout logfile before it's rotated to 0, which means the logfile will not be rotated.</li>
         <li><strong>redirect_stderr=true</strong>: This tells supervisord to redirect the stderr to the stdout logfile. This means that both standard output and standard error from the program will be written to the same logfile.</li>
      </ul>
      <h2>[program:thunderbird]</h2>
      <p>This section defines the Thunderbird program that supervisord should manage.</p>
      <pre>
[program:thunderbird]
priority=1
environment=DISPLAY=:0
command=/usr/bin/thunderbird
autorestart=true
stdout_logfile=/dev/fd/1
stdout_logfile_maxbytes=0
redirect_stderr=true
</pre>
      <ul>
         <li><strong>priority=1</strong>: This determines the order in which programs are started and shut down. Lower numbers have higher priority. This program will be started after all programs with a lower priority number and shut down before them.</li>
         <li><strong>environment=DISPLAY=:0</strong>: This sets the DISPLAY environment variable for the program. This tells the program which X display it should connect to.</li>
         <li><strong>command</strong>: This is the command that will be run to start the program. In this case, it starts the Thunderbird email client.</li>
         <li><strong>autorestart=true</strong>: This tells supervisord to automatically restart the program if it exits. If Thunderbird crashes or is killed, supervisord will automatically start a new instance.</li>
         <li><strong>stdout_logfile=/dev/fd/1</strong>: This is the location where the program's standard output will be written. <code>/dev/fd/1</code> is a link to the standard output, so log messages will be sent to the standard output. This is useful when running inside a Docker container.</li>
         <li><strong>stdout_logfile_maxbytes=0</strong>: This sets the maximum size of the stdout logfile before it's rotated to 0, which means the logfile will not be rotated. This is useful when you want to handle log rotation outside of supervisord, for example, with a system-wide log rotation service.</li>
         <li><strong>redirect_stderr=true</strong>: This tells supervisord to redirect the stderr to the stdout logfile. This means that both standard output and standard error from the program will be written to the same logfile.</li>
      </ul>
   </body>
</html>
