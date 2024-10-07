const { Op } = require('sequelize');
const Product = require('../models/Product');

// Obter todos os produtos com suporte à paginação e busca
const getProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;  // Quantos produtos por página
  const page = parseInt(req.query.page) || 1;  // Qual página buscar
  const offset = (page - 1) * limit;  // Calcula o deslocamento para a paginação
  const searchTerm = req.query.search || '';  // Termo de busca

  try {
    // Filtro de busca pelo nome do produto
    const whereCondition = searchTerm ? {
      name: {
        [Op.iLike]: `%${searchTerm}%`  // Busca produtos cujo nome contém o termo, ignorando maiúsculas/minúsculas
      }
    } : {};

    // Buscando produtos com filtro e paginação
    const products = await Product.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    res.status(200).json({
      totalItems: products.count,  // Total de produtos
      totalPages: Math.ceil(products.count / limit),  // Quantidade total de páginas
      currentPage: page,
      data: products.rows,  // Produtos da página atual
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
  }
};

// Obter produto por ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter o produto', error: err.message });
  }
};

// Criar novo produto
const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const product = await Product.create({ name, price, quantity });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar o produto', error: err.message });
  }
};

// Editar produto
const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;  // Certifique-se de que você está recebendo os dados certos
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Atualiza apenas se os valores forem fornecidos
    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar o produto', error: err.message });
  }
};

// Deletar produto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await product.destroy();
    res.status(204).send();  // 204 significa que foi deletado com sucesso
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar o produto', error: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
