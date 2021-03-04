npm install yarn -g;
npm install pm2 -g;
yarn;
yarn sequelize db:migrate;
yarn sequelize db:seed:all;
yarn build;
cp src/assets build/ -r
cp src/mailTemplate build/ -r
pm2 start build/server.js --name=api
