# mysql学习笔记

记录一下学习mysql的过程，施工中。

## 安装

```shell
homebrew install mysql
```

## 启动遇到的问题

I installed MySQL on Mac OS, but when I tried mysql -u root I got the following 

```
error:
	ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)
```

  You'll need to start MySQL before you can use the mysql command on your terminal. To do this, run 

```
brew services start mysql
```

   By default, brew installs the MySQL database without a root password. To secure it run: 

```
mysql_secure_installation
```

