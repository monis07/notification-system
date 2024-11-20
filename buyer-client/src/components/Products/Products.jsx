import { useState,useEffect } from 'react'
import axios from 'axios'
import Navbar from '../Navbar/Navbar'

const API_URL = 'https://notification-system-phfp.onrender.com'


function Products(){

    const [products,setProducts]=useState([])
    useEffect(()=>{
        fetchProducts()
    },[])
    const fetchProducts = async()=>{
        const options={
            method:'GET',
            url:API_URL+'/buyer/getPreferences',
            headers:{
                'Content-Type':'application/json',
                authorization:localStorage.getItem('buyer-token')
            }
        }
        const response=await axios.request(options)
        setProducts(response.data.products)

        console.log(response.data.products)
    }
    
    const handleInterested = async (productId) => {


        const options = {
            method : 'POST',
            url : API_URL + '/buyer/productInterest/' + productId,
            headers : {
                'Content-Type' : 'application/json',
                authorization : localStorage.getItem('buyer-token')
            }
        }

        const response = await axios.request(options)
        if(response.status >= 200 && response.status < 300){
            alert("Interest recorded successfully")
            window.location.reload()
        }
        else{
            alert("Error recording your interest")
        }
    }

    const handleNotInterested = async (productId) => {
        const options = {
            method : 'POST',
            url : API_URL + '/buyer/noproductInterest/' + productId,
            headers : {
                'Content-Type' : 'application/json',
                authorization : localStorage.getItem('buyer-token')
            }
        }

        const response = await axios.request(options)
        if(response.status >= 200 && response.status < 300){
            alert("Feedback recorded successfully")
            window.location.reload()
        }
        else{
            alert("Error recording your interest")
        }
        
    }

    return(
        <>
        <Navbar></Navbar>
        {products.length===0? "No products found":
    products.map((product)=>{
            return (
                <div key={product._id} className="border rounded p-4 m-2">
                    <h2 className="font-semibold mb-2">Title : {product.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">Category : {product.category}</p>
                    <p className="mb-2">Description : {product.description}</p>
                    <div className="flex justify-between items-center">
                        <p className="font-bold">${product.price}</p>
                        <div>
                            <button 
                                onClick={() => handleInterested(product._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                            >
                                Interested
                            </button>
                            <button 
                                onClick={() => handleNotInterested(product._id)}
                                className="bg-gray-500 text-white px-3 py-1 rounded"
                            >
                                Not Interested
                            </button>
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