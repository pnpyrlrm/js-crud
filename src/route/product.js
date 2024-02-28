// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []
  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = () => {
      this.date = new Date().toISOString()
    }
  }
  static getList = () => this.#list
  checkId = (id) => this.id === id
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name } = data
    if (product) {
      if (name) {
        product.name = name
      }
      return true
    } else {
      return false
    }
  }
  static update = (name, { product }) => {
    if (name) {
      product.name = name
    }
  }
}

// ================================================================

router.get('/product-create', function (req, res) {
  const list = Product.getList()
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно був створений',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  console.log(list)
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  // console.log(product)
  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        id: product.id,
        description: product.description,
      },
    })
  } else {
    return res.render('alert', {
      style: 'alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})
// ↑↑ сюди вводимо JSON дані
// ================================================================

router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body
  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })
  console.log(id)
  console.log(product)
  if (product) {
    res.render('alert', {
      style: 'alert',
      info: 'Інформація про товар оновлена',
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Сталася помилка',
    })
  }
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let result = Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно видалений'
      : 'Сталася помилка! Товар не був видалений!',
  })
})

// Підключаємо роутер до бек-енду
module.exports = router
