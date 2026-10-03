const express = require('express');
const router = express.Router();

const { Categoria } = require('../models');

router.get('/', async (req, res) => {
  const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });

  res.render('categorias/index', {
    categorias
  });
});

router.get('/novo', (req, res) => {
  res.render('categorias/novo');
});

router.post('/', async (req, res) => {
  await Categoria.create({ nome: req.body.nome });

  res.redirect('/categorias');
});

router.get('/:id/editar', async (req, res) => {
  const categoria = await Categoria.findByPk(req.params.id);

  if (!categoria) {
    return res.redirect('/categorias');
  }

  res.render('categorias/editar', {
    categoria
  });
});

router.post('/:id', async (req, res) => {
  await Categoria.update(
    { nome: req.body.nome },
    {
      where: {
        id: req.params.id
      }
    }
  );

  res.redirect('/categorias');
});

router.post('/:id/deletar', async (req, res) => {
  try {
    await Categoria.destroy({
      where: {
        id: req.params.id
      }
    });
  } catch (err) {}

  res.redirect('/categorias');
});

module.exports = router;
