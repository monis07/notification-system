import { useState,useEffect } from 'react'
import axios from 'axios'
import Navbar from '../Navbar/Navbar'

function Products(){

    const API_URL = import.meta.env.VITE_API_URL



    const [products,setProducts]=useState([])
    const [newProduct, setNewProduct] = useState({
        title: '', description: '', price: '', category: 'Chairs'
    })

    const categories = ['Chairs', 'Tables', 'Sofa', 'Lamp']

    useEffect(()=>{
        fetchProducts()
    },[])
    const fetchProducts = async()=>{
        const options={
            method:'GET',
            url:API_URL+'/seller/getProducts',
            headers:{
                'Content-Type':'application/json',
                authorization:localStorage.getItem('seller-token')
            }
        }
        const response=await axios.request(options)
        setProducts(response.data.products)
    }

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const options = {
                method: 'POST',
                url: API_URL + '/seller/addProduct',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('seller-token')
                },
                data: {
                    ...newProduct,
                    price: Number(newProduct.price)
                }
            }
            await axios.request(options)
            fetchProducts()
            setNewProduct({
                title: '',
                description: '',
                price: '',
                category: 'Chairs'
            })
        } catch (error) {
            console.error('Error adding product:', error)
        }
    }

    return(
        <>
        <Navbar></Navbar>
        <div className="mx-auto mt-8 p-4 shadow rounded text-black bg-white">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={newProduct.title}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 text-sm"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm mb-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 text-sm"
                        required
                    />
                </div>
                <div className="w-24">
                    <label className="block text-sm mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        min="1"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 text-sm"
                        required
                    />
                </div>
                <div className="w-32">
                    <label className="block text-sm mb-1">Category</label>
                    <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 text-sm"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Product
                </button>
            </form>
        </div>

        {products.length===0? "No products found":
    products.map((product)=>{
        const id = "/buyers/"+product._id
            return (
                <div key={product._id} className="border rounded p-4 m-2">
                    <h2 className="font-semibold mb-2">Title : {product.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">Category : {product.category}</p>
                    <p className="mb-2">Description : {product.description}</p>
                    <div className="flex justify-between items-center">
                        <p className="font-bold">${product.price}</p>
                        <div>
                            <a href={id} className='text-blue-500'>Interested Buyers (Click for more details)</a>
                        </div>
                    </div>
                </div>
            )
    })
    }
        </>
    )

}
export default Products