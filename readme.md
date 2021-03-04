# Versões dos softwares utilizados:
  node v12.18.2
  npm v6.14.5

# Introdução
  Esse e um sistema para o gerenciamento de animais domésticos que se encontram em situação de vulnerabilidade. Onde um usuário pode cadastrar um animal para adoção em uma ONG (Região), ou também pode cadastrar um animal desaparecido. Vale ressaltar que os animais cadastrados por um usuário terão que ser previamentes aceitos pelas ONGs para começar a aparecer no sistema.

# Como utilizar
1 -  Crie o banco de dados com o nome ``adoraveis``
  Obs: No teste foi a extensão uuid-ossp


2 - Altere o arquivo .env conforme a necessidade
  - ```API_PORT``` - Porta onde rodará o servidor.
  - ```API_API_URL``` - Domínio da API.
  - ```API_WEB_URL``` - Domínio da página web.

  - ```DB_HOST``` - IP para acessar o banco de dados
  - ```DB_USER``` - Usuário para acessar o banco de dados
  - ```DB_PASS``` - Senha para acessar o banco de dados
  - ```DB_NAME``` - Nome do Banco de dados

  - ```MAIL_USER``` - Usuário SMPT para envio de email
  - ```MAIL_PASS``` - Senha do SMTP para o envio de email

  - ```TEST_MAIL_USER``` - Usuário SMPT para envio de email para testes
  - ```TEST_MAIL_PASS``` - Senha do SMTP para o envio de email para testes


3 - Rode o comando na pasta raiz do projeto:
  - ```npm```  ou ```yarn```

  Nota: Este comando irá baixar as dependências das bibliotecas (node_modules)


4 - Rode o commando na pasta raiz do projeto:
  - ```npm sequelize db:migrate```
  - ```npm sequelize db:seed:all```

  Nota: Este comando irá criar as tabelas no banco de dados e irá popular elas


5 - Rode o commando na pasta raiz do projeto:
  - ```npm run dev:server```

  Nota: Este comando irá iniciar o backend


# Rotas no Postman

Para utilizar as rotas do backend no software Postman, utilize os arquivos presentes na pasta raiz do documento:
  - ```dev.postman_collection.json```
  - ```dev.postman_environment.json```

# Rotas existentes
  **Users**
  - ```POST /users```: Cadastra um novo usuário
  - ```PUT /users```: Altera os dados de um usuário ja cadastrado
  - ```POST /users/password/forget```: Envia um e-mail para redefinir a senha
  - ```PUT /users/password/reset```: Altera a senha do usuário

  **Auth**
  - ```POST /auth```: Realiza a autenticação do usuário

  **My - Todas as rotas abaixo necessitam que o usuário esteja autenticado**

  Rotas relacionadas ao próprio usuário
  - ```GET /my/user```: Lista as informações do usuário
  - ```PUT /my/user```: Altera os dados do próprio usuário

  Rotas relacionadas aos animais do usuário
  - ```POST /animals/:region```: Cadastra um novo animal em uma determinada região
  - ```GET /animals/list/count```: Mostra a quantidade de animais cadastrados pelo usuário
  - ```GET /animals/list```:  Mostra a lista de animais cadastrado
  - ```PUT /animals/:id```: Altera a informação de um  determinado animal
  - ```DELETE /animals/:id```: Deleta um determinado animal
  - ```PATCH /animals/adopt/:id```: Marca o animal como adotado

  **Breeds**
  - Rotas relacionadas aos animais do usuário
  - ```GET /breed```: Mostra a lista das espécies e racas existentes no banco de dados

  **Animals**
  - ```GET /:region/:category/count/```: Mostra a quantidade de animais cadastrados em uma determinada região e categoria (Adoção ou Desaparecidos)
  - ```GET /animals/:id```: Mostra as informações de determinado animal
  - ```GET /animals/list/:category```:  Mostra a lista de animais de uma determinada categoria (Adoção ou Desaparecidos)

  **Admin - Todas as rotas abaixo necessitam que sejam executadas pelo administrador de uma região**
  - ```GET /:region/admin/animal/verify```: Mostra a lista de animais que precisam ser aprovados em uma determinada região
  - ```GET /:region/admin/animal/verify/count```: Mostra a quantidade de animais que precisam ser aprovados em uma determinada região
  - ```PATCH /:region/admin/animal/verify/:id```: Marca o animal como adotado
  - ```PATCH /:region/admin/animal/refuse/:id```: Marca o animal como recusado

  **Server**
  - ```GET /```: Lista todos as regiões cadastradas no banco de dados

  Obs: **Todas as rotas abaixo necessitam que sejam executadas pelo administrador do sistema**
  - ```POST /servers```: Cria uma nova região no sistema
  - ```PUT /servers/:id```: Altera as informações de uma região
  - ```DELETE /servers/:id```: Apaga uma região do banco de dados

  **SystemAdmin - Todas as rotas abaixo necessitam que seja executada pelo administrador do sistema**
  - ```GET /system-admin/admins```: Mostra os administradores de cada região
  - ```POST /system-admin/admins```: Cadastra um novo administradores em uma região
  - ```DELETE /system-admin/admins/:id```: Apaga um administrador de uma região


