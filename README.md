# node.js MySQL
使用Express.js和sequelize
---
## 環境建置
* Visual Studio Code
* bcryptjs:"^2.4.3",
*  express: "^4.17.1",
*  express-handlebars: "^4.0.4",
*  express-session: "^1.17.1",
*  method-override: "^3.0.0",
*  mysql2: "^2.3.3",
*  passport: "^0.4.1",
*  passport-local: "^1.0.0",
*  sequelize: "^6.17.0",
*  sequelize-cli: "^6.4.1"
---
## 安裝流程
1. 開啟終端機，並cd 要放專案的位置並執行:

```
git clone https://github.com/ioriayaka/todo-sequelize.git
```

2. 進入專案資料夾

```
cd todo-sequelize.git
```

3. 安裝 npm 套件

```
npm install
```

4. 安裝 nodemon 套件 (若未安裝)

```
npm install -g nodemon
```
5. 建立資料庫
* 開啟 MySQL workbench，再連線至本地資料庫，輸入以下建立資料庫 

```
drop database if exists user_list;
create database user_list;
use user_list;
```
6. 建立資料庫欄位
```
npx sequelize db:migrate
```

7. 建立種子資料
```
npx sequelize db:seed:all
```

8. 啟動伺服器，執行 app.js 檔案

```
npm run dev
```

10. 當終端機出現以下字樣，表示啟動完成

```
App is running on http://localhost:3000
```
## 預設管理者 SEED_USER
*   name: root
*   password: 12345678