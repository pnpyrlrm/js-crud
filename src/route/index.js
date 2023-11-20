// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)

      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  console.log(typeof id)

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  console.log(email, password, id)

  res.render('success-info', {
    style: 'success-info',
    info: result
      ? 'Email пошта оновлена'
      : 'Сталася помилка',
  })
})

// ================================================================

class Product {
  static #list = []

  constructor(id, createDate, name, price, description) {
    this.id =
      Math.floor(Math.random() * (99999 - 10000 + 1)) +
      10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    this.#list.find((product) => product.id === id)
  }

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.updPrice(product, data)
      this.updName(product, data)
      this.updDescr(product, data)

      return true
    } else {
      return false
    }
  }
  static updPrice = (product, { price }) => {
    if (price) {
      product.price = price
    }
  }
  static updName = (product, { name }) => {
    if (name) {
      product.name = name
    }
  }
  static updDescr = (product, { description }) => {
    if (description) {
      product.description = description
    }
  }

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
}

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add = product

  res.render('alert', {
    style: 'alert',
    info: 'Товар успішно був створений',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const productList = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    productList,
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      info: `Товар з ID ${id} не знайдено...`,
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, description } = req.body
  const { id } = req.body

  result = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  res.render('alert', {
    style: 'alert',
    info: result
      ? 'Товар успішно був оновлений'
      : 'Сталася помилка! Товар не був оновлений!',
  })
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
