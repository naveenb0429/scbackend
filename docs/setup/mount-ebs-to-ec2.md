Video KT - https://www.youtube.com/watch?v=VnO3Lz7Qr0U

## Commands
### Check disks
```shell
ubuntu@i-08c296cd49897083e:/$ df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root         14G  1.7G   12G  13% /
tmpfs            1.9G     0  1.9G   0% /dev/shm
tmpfs            772M  844K  772M   1% /run
tmpfs            5.0M     0  5.0M   0% /run/lock
/dev/nvme0n1p15  105M  6.1M   99M   6% /boot/efi
tmpfs            386M  4.0K  386M   1% /run/user/1000
```

### Check available devices 
```shell
ubuntu@i-08c296cd49897083e:~$ lsblk
NAME         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
nvme1n1      259:0    0    15G  0 disk
nvme0n1      259:1    0    14G  0 disk
├─nvme0n1p1  259:2    0  13.9G  0 part /
├─nvme0n1p14 259:3    0     4M  0 part
└─nvme0n1p15 259:4    0   106M  0 part /boot/efi
```


### Formatting the device if not done
ftype=1 is to create case sensitive filesystem otherwise the software like mysql wont work
```shell
ubuntu@i-08c296cd49897083e:~$ sudo file -s /dev/nvme1n1 
/dev/nvme1n1: data
# Which means drive was never formatted & we need to setup file system by formatting it

ubuntu@i-08c296cd49897083e:~$ sudo mkfs -t xfs -n ftype=1 /dev/nvme1n1 -f
meta-data=/dev/nvme1n1           isize=512    agcount=16, agsize=245760 blks
=                       sectsz=512   attr=2, projid32bit=1
=                       crc=1        finobt=1, sparse=1, rmapbt=0
=                       reflink=1    bigtime=0 inobtcount=0
data     =                       bsize=4096   blocks=3932160, imaxpct=25
=                       sunit=1      swidth=1 blks
naming   =version 2              bsize=4096   ascii-ci=0, ftype=1
log      =internal log           bsize=4096   blocks=2560, version=2
=                       sectsz=512   sunit=1 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0

ubuntu@i-08c296cd49897083e:~$ sudo file -s /dev/nvme1n1
/dev/nvme1n1: SGI XFS filesystem data (blksz 4096, inosz 512, v2 dirs)
```


### Mounting device to a folder
```shell
ubuntu@i-08c296cd49897083e:~$ sudo mkdir /sustaincred
ubuntu@i-08c296cd49897083e:~$ cd /sustaincred/
ubuntu@i-08c296cd49897083e:/sustaincred$ sudo chown ubuntu . && chmod 777 .
sudo mount /dev/nvme1n1 /sustaincred
```

### Revalidate again
```shell
ubuntu@i-08c296cd49897083e:/$ df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root         14G  1.7G   12G  13% /
tmpfs            1.9G     0  1.9G   0% /dev/shm
tmpfs            772M  844K  772M   1% /run
tmpfs            5.0M     0  5.0M   0% /run/lock
/dev/nvme0n1p15  105M  6.1M   99M   6% /boot/efi
tmpfs            386M  4.0K  386M   1% /run/user/1000
/dev/nvme1n1      15G  140M   15G   1% /sustaincred
```