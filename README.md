# Cadastro de Produtos — MVC

## Eu
    Nome: Gabriel Comparini
    RM: 20240147

## Como executar
    npm install
    npm start
    Abrir http://localhost:3000/produtos

## Funcionalidades
    Cadastro de produtos
    Listagem de produtos
    Edição de produtos
    Exclusão de produtos
    Cadastro de categorias
    Listagem de categorias
    Produtos por categoria
    Pesquisa de produtos por nome

## Desafios
    Desafio 1: criado o model Categoria e associado ao Produto com hasMany e belongsTo pela chave categoriaId.
    Desafio 2: criada a rota GET /produtos/categoria/:id que filtra com findAll where categoriaId.
    Extra: pesquisa por nome com findAll where nome LIKE %termo% usando Op.like em /produtos?busca=.