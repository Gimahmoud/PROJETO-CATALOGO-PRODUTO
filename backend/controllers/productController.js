const { Op } = require('sequelize');
const Product = require('../models/Product');

// Obter todos os produtos com suporte à paginação e busca
const getProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.name || '';
  const orderBy = req.query.orderBy || '';

  try {
    let order = [];

    // Verifica a ordenação passada e define a ordem correspondente
    switch (orderBy) {
      case 'quantity-asc':
        order = [['quantity', 'ASC']];
        break;
      case 'quantity-desc':
        order = [['quantity', 'DESC']];
        break;
      case 'price-asc':
        order = [['price', 'ASC']];
        break;
      case 'price-desc':
        order = [['price', 'DESC']];
        break;
      default:
        order = [];  // Sem ordenação
    }

    const whereCondition = searchTerm ? {
      name: {
        [Op.iLike]: `%${searchTerm}%`
      }
    } : {};

    const products = await Product.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: order,  // Aplica a ordenação
    });

    res.status(200).json({
      totalItems: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: page,
      data: products.rows,
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

// Criar novo produto com validação de nome duplicado
const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    // Verifica se já existe um produto com o mesmo nome (case-insensitive)
    const existingProduct = await Product.findOne({
      where: { name: { [Op.iLike]: name } }
    });

    if (existingProduct) {
      return res.status(400).json({ message: 'Já existe um produto com este nome.' });
    }

    const product = await Product.create({ name, price, quantity });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar o produto', error: err.message });
  }
};

// Editar produto com validação de nome duplicado
const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // Verificar se o nome já existe em outro produto (excluindo o produto atual)
    if (name && name !== product.name) {
      const existingProduct = await Product.findOne({
        where: {
          name: { [Op.iLike]: name },
          id: { [Op.ne]: product.id }  // Excluir o próprio produto da verificação
        }
      });

      if (existingProduct) {
        return res.status(400).json({ message: 'Já existe um produto com este nome.' });
      }
    }

    // Atualizar os campos do produto
    if (name) product.name = name;
    if (price) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    await product.save();
    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json({ message: 'Erro ao atualizar o produto', error: err.message });
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
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar o produto', error: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
