# Instruções para Executar a Aplicação

## 1. Criação da Tabela no Banco de Dados

Antes de executar a aplicação, é necessário criar a tabela no banco de dados. Use o script SQL abaixo para criar a tabela `Products` no PostgreSQL:

```sql
CREATE TABLE Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL, 
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


# 2. Configuração do Banco de Dados
Após criar a tabela, configure a conexão com o banco de dados no arquivo db.js, localizado na pasta config.

Na linha 4 do arquivo db.js, substitua os campos pela configuração correta do seu banco de dados PostgreSQL.

Aqui está a linha a ser modificada:

const sequelize = new Sequelize('postgres://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO', {

Parâmetros:
USUARIO: O nome de usuário do seu banco de dados PostgreSQL.
SENHA: A senha do usuário do banco de dados.
HOST: O endereço do servidor onde o banco de dados está hospedado (pode ser localhost se for local).
PORTA: A porta em que o PostgreSQL está rodando (geralmente 5432 por padrão).
NOME_DO_BANCO: O nome do banco de dados ao qual você está se conectando.

3. Executando a Aplicação
Após configurar a conexão com o banco de dados, siga os passos abaixo para iniciar a aplicação:

Para iniciar o backend na porta 5000 e o frontend na porta 3000, execute o comando:

npm start

(O projeto ja esta com as dependências) 
