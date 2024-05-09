# read-roster

Read Roster merupakan aplikasi dengan sistem peminjaman buku untuk tracking data peminjaman dan pengembalian buku oleh User/ Peminjam

## Installation
**1.** Clone Project :
```
git clone https://github.com/aldoLorenzio/read-roster.git
```

**2.** Install the dependencies :
```
npm install
```

**3.** Add .env file :
```
DB_URL = YOUR_URL (POSTGRE)
JWT_SECRET = YOUR_SECRET_KEY
JWT_ACCESS_EXPIRATION_MINUTES = 120 //if you want JWT access valid for 120 minutes
JWT_REFRESH_EXPIRATION_DAYS = 30 //if you want JWT refresh valid for 30 days (still not work, cause i still not develope it yet)
```

**4.** Run the project :
```
npm run dev
```


## API End Point
**- AUTH Route** \
User Register                : `POST /v1/auth/register`\
User Login                   : `POST /v1/auth/login`\
User Logout                  : `GET /v1/auth/logout`

**- USER Route** \
Get Users                    : `GET /v1/users/`\
Get User By ID               : `GET /v1/users/:userId`\
Update User By ID            : `PATCH /v1/users/:userId`\
Delete User By ID            : `DELETE /v1/users/:userId`

**- Genre Route** \
Create Genre                 : `POST /v1/genre/`\            
Get Genres                   : `GET /v1/genre/`\
Get Genre By ID              : `GET /v1/genre/:genreId`\
Update Genre By ID           : `PATCH /v1/genre/:genreId`\
Delete Genre By ID           : `DELETE /v1/genre/:genreId`

**- Buku Route** \
Create Buku                  : `POST /v1/buku/`\
Get Bukus                    : `GET /v1/buku/`\
Get Buku By ID               : `GET /v1/buku/:bukuId/`\
Update Buku By ID            : `PATCH /v1/buku/:bukuId`\
Delete Buku By ID            : `DELETE /v1/buku/:bukuId`

**- Peminjaman Route** \
Create Peminjaman            : `POST /v1/peminjaman/`\
Get Peminjamans              : `GET /v1/peminjaman/`\
Get Peminjaman By ID         : `GET /v1/peminjaman/:peminjamanId/`\
Update Peminjaman By ID      : `PATCH /v1/peminjaman/:peminjamanId`\
Delete Peminjaman By ID      : `DELETE /v1/peminjaman/:peminjamanId`

Read in routes/v1 inside auth("") what roles can access this API, \
if in route files there was :
```
.post(auth('admin'), validate(bukuValidation.createBuku), bukuController.createBuku)
```

it means only Admin can access this API's \
if in route files there was :

```
  .post(auth('manageUsers'), validate(peminjamanValidation.createPeminjaman), peminjamanController.createPeminjaman)
```
it means Users and Admin can access this API's