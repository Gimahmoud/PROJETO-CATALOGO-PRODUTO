const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');  // Importando o controller

// Rotas CRUD para produtos
router.get('/', getProducts);  // Listar todos os produtos
router.get('/:id', getProduct);  // Obter um produto específico
router.post('/', createProduct);  // Criar novo produto
router.put('/:id', updateProduct);  // Atualizar um produto existente
router.delete('/:id', deleteProduct);  // Deletar um produto

module.exports = router;
