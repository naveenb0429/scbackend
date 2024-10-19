#manages processes from the ubuntu linux commands
ps -aux
sudo ps -a
sudo ps -U username
ps -U username
ps -aux | more
sudo ps - aux | less
example: ps aux | grep nginx

#Pgrep command to search/find process
pgrep process
sudo pgrep sshd
pgrep vim
pgrep -l nginx

#linux server resource usage
top 
sudo top

#easy to use process viewer from the cli on ubuntu linux
htop
sudo htop

#linux kill command - kill process
kill pid
kill -signal pid
example: kill 29985 (PID #29985)

pkill #kill by process by name
pkill processname
example: pkill vim , pkill firefox
sudo pkill -KILL php7-fpm

#killall - command kills processes by name as opposed to the selection by PID as done by kill command.
killall vim
killall -9 emacs

#to change the priority of a running process , type the following
renice {priority} -p {PID}
renice {priority} {PID}
pgrep vim
sudo renice -10 $(pgrep vim)

#Suspend the process with CTRL+Z then use the command bg to resume it in background

#To start a process where you can even kill the terminal and it still carrries on running
nohup [command] [-args] > [filename] 2>&1 &

#To run linux process in the background: - To run your process or command/shell script in the background, include an & (ampersand) at the end of the command/shell script you use to run the job.
command &
/path/to/script &

#run the jobs command - jobs

#To stop the foreground process press (CTRL+z). One can refers to the background process or stopped process by number For example , vim is stopped has 1 as number so run the bg command to restart a stopped background process:
bg %n (bg %1)

#background process to the foreground such as sleep command using fg command:
fg %n 

#kill a running process named "process name and value" using kill command
kill %n

#how do i list only running processes on linux?
ps r
#list all processes on this current terminal?
ps T
#Display linux processes without controlling ttys
ps X

#If you need to log out of your terminal session, and you would like it to continue running use this below command
disown

#check drive mount - lsblk , sudo mount /dev/nvme1n1 /Newvolume 

