import { Router } from "express";

const productsRouter = (prodManager) => {
    const router = Router();

    router.get('/', (req, res) => {
        try {
            const products = prodManager.getProducts();
            const limit = req.query.limit;

            if (limit) {
                res.json({ products: products.slice(0, limit) });
            } else {
                res.json({ products });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    router.get('/:pid', (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const product = prodManager.getProductByID(productId);

            if (product) {
                res.json({ product });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    router.post('/', (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails } = req.body;

            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
            }

            const newProduct = {
                id: "",
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails: thumbnails || [],
            };

            prodManager.addProduct(newProduct);

            res.status(201).json({ product: newProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    router.put('/:pid', (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const updatedProduct = req.body;
            console.log(updatedProduct);

            const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
            for (const field of requiredFields) {
                if (!updatedProduct[field]) {
                    return res.status(400).json({ error: `Falta completar el campo "${field}" del producto` });
                }
            }

            prodManager.updateProduct(productId, updatedProduct);

            res.json({ message: 'Producto actualizado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    router.delete('/:pid', (req, res) => {
        try {
            const productId = parseInt(req.params.pid);

            prodManager.deleteProduct(productId);

            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    return router;
};

export default productsRouter;