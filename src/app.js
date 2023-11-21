import express from 'express';

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

import { ProductManager } from './productManager.js';
import { CartManager } from './cartManager.js';

const app = express();
const port = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const prodManager = new ProductManager("./Productos.json");
const cartManager = new CartManager("./Carritos.json", prodManager);



app.use('/api/products', productsRouter(prodManager));
app.use('/api/carts', cartsRouter(cartManager, prodManager));

app.get('/', (req, res) => {
    res.send('Bienvenido a mi aplicación.');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
