const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { Produto, Categoria } = require('../models');

// Escapa %, _ e \ para não virarem curinga acidental no LIKE.
function escapeLike(str) {
  return str.replace(/[\\%_]/g, (m) => '\\' + m);
}

router.get('/', async (req, res) => {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  const { categoriaId } = req.query;
  const termoBusca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';

  // Filtros opcionais via query: /produtos?categoriaId=1&busca=mouse
  // (o formulário da página usa esse formato)
  const where = {};

  let categoriaAtual = null;
  if (categoriaId) {
    categoriaAtual = await Categoria.findByPk(categoriaId);

    if (!categoriaAtual) {
      return res.redirect('/produtos');
    }

    where.categoriaId = categoriaId;
  }

  // Desafio extra: pesquisa por nome com LIKE '%termo%'.
  // SQLite LIKE já é case-insensitive para ASCII: "mouse" acha "Mouse".
  if (termoBusca) {
    where.nome = { [Op.like]: `%${escapeLike(termoBusca)}%` };
  }

  const produtos = await Produto.findAll({
    where,
    include: { model: Categoria, as: 'Categoria' },
    order: [['id', 'ASC']]
  });

  res.render('produtos/index', {
    produtos,
    categorias,
    categoriaAtual,
    termoBusca
  });
});

router.get('/novo', async (req, res) => {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });

  res.render('produtos/novo', {
    categorias
  });
});

// Desafio 2: listar produtos de uma categoria.
// Ex.: /produtos/categoria/1 -> só produtos com categoriaId = 1.
// Declarada antes de /:id/editar para não haver ambiguidade.
// Aceita ?busca= opcional para combinar categoria + pesquisa.
router.get('/categoria/:id', async (req, res) => {
  const categoriaAtual = await Categoria.findByPk(req.params.id);

  if (!categoriaAtual) {
    return res.redirect('/produtos');
  }

  const termoBusca = typeof req.query.busca === 'string' ? req.query.busca.trim() : '';
  const where = { categoriaId: req.params.id };

  if (termoBusca) {
    where.nome = { [Op.like]: `%${escapeLike(termoBusca)}%` };
  }

  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
  const produtos = await Produto.findAll({
    where,
    include: { model: Categoria, as: 'Categoria' },
    order: [['id', 'ASC']]
  });

  res.render('produtos/index', {
    produtos,
    categorias,
    categoriaAtual,
    termoBusca
  });
});

router.post('/', async (req, res) => {
  await Produto.create({
    nome: req.body.nome,
    preco: req.body.preco,
    quantidade: req.body.quantidade || 0,
    categoriaId: req.body.categoriaId
  });

  res.redirect('/produtos');
});

router.get('/:id/editar', async (req, res) => {
  const produto = await Produto.findByPk(req.params.id, {
    include: { model: Categoria, as: 'Categoria' }
  });
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });

  if (!produto) {
    return res.redirect('/produtos');
  }

  res.render('produtos/editar', {
    produto,
    categorias
  });
});

router.post('/:id', async (req, res) => {
  await Produto.update(
    {
      nome: req.body.nome,
      preco: req.body.preco,
      quantidade: req.body.quantidade || 0,
      categoriaId: req.body.categoriaId
    },
    {
      where: {
        id: req.params.id
      }
    }
  );

  res.redirect('/produtos');
});

router.post('/:id/deletar', async (req, res) => {
  await Produto.destroy({
    where: {
      id: req.params.id
    }
  });

  res.redirect('/produtos');
});

module.exports = router;
