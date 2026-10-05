-- `prisma migrate dev` creates and drops a temporary shadow database,
-- so the app user needs privileges beyond the sagan_beauty schema.
GRANT ALL PRIVILEGES ON *.* TO 'sagan'@'%';
FLUSH PRIVILEGES;
