import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path
        if (fs.existsSync(path)) {
            try {
                let productos = fs.readFileSync(path, "utf-8")
                this.products = JSON.parse(productos)
            } catch (error) {
                this.products = []
            }
        } else {
            this.products = []
        }
    }

    async saveFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'))
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
    getProducts() {
        return this.products;
    }

    isCodeDuplicate(code) {
        return this.products.some(product => product.code === code);
    }

    getProductByID(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("¡Producto no encontrado!");
        }
    }

    async addProduct(product) {
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
        for (const field of requiredFields) {
            if (!product[field]) {
                return console.log(`Falta completar el campo "${field}" del producto`);
            }
        }

        if (this.isCodeDuplicate(product.code)) {
            return console.log('¡El código del producto ya existe!');
        }

        product.id = this.getNextProductId();
        this.products.push(product);

        const respuesta = await this.saveFile(this.products);
        if (respuesta) {
            console.log('Producto añadido');
        } else {
            console.log('Hubo un error al añadir producto');
        }
    }

    getNextProductId() {
        const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = this.products.find((prod) => prod.id === id);
            const index = this.products.findIndex(prod => prod.id === id);
            if (index === -1) {
                console.log('No se encontro el producto');
                return;
            }
            updatedProduct.id = product.id;
            this.products[index] = updatedProduct;
            await this.saveFile(this.products);
            console.log("Actualizado correctamente");
            return update;
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            const respuesta = await this.saveFile(this.products);
            if (respuesta) {
                console.log("Producto eliminado correctamente");
            } else {
                console.log("Hubo un error al eliminar el producto");
            }
        } else {
            console.log("Producto no encontrado");
        }
    }
}

class Product {
    constructor(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
    ) {
        this.id = "";
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

// ! -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const producto1 = new Product("CPU Intel Core i7-9700K", "8 Cores, 8 Threads, 3.6 GHz Base Clock, 4.9 GHz Max Boost Clock, 12 MB Cache, LGA 1151 Socket", 369.99, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHmKo364U52cxJePkBs2aI92O87EujQAYwKWEcjGcKfULkgP-WfkJs_wCv5t03-wLcOw4&usqp=CAU", "BX80684I79700K", 15)
const producto2 = new Product("HDD Seagate BarraCuda 2TB", "SATA 6 Gb/s, 7200 RPM, 3.5-inch Internal Hard Drive, 256 MB Cache", 54.99, "https://www.venex.com.ar/products_images/1609786191_245345.png", "ST2000DM008", 20)
const producto3 = new Product("Power Supply Corsair RM750x", "750W, 80 PLUS Gold Certified, Fully Modular, Zero RPM Fan Mode", 129.99, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCY_WHJAS_X0V8hLPUNm5sEku7HMNKzRuAvuT7D-0T6erTEsJJDaPN9UCJQPXLHBgHHJg&usqp=CAU", "CP9020179NA", 12)

const prodManager = new ProductManager("./Productos.json")

// ! -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export { ProductManager, Product };