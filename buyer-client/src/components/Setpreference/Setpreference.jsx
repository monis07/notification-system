import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import Navbar from '../Navbar/Navbar';

const API_URL = 'https://notification-system-phfp.onrender.com'

function Setpreference() {
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({
        minimum: 0,
        maximum: 100
    });

    const [msg,setMsg]=useState('Save Preferences')

    const productOptions = ['Chairs', 'Tables', 'Sofa', 'Lamp'];

    const handleProductChange = (product) => {
        setSelectedProducts(prev => prev.includes(product) ? prev.filter(item => item !== product) : [...prev, product]
        );
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const options={
            method:'POST',
            url:API_URL+'/buyer/setPreferences',
            headers:{
                'Content-Type':'application/json',
                authorization:localStorage.getItem('buyer-token')
            },
            data:{
                productPreferences:selectedProducts,
            pricePreferences:priceRange
            }
        }
        try{
            setMsg("Loading...")
            const response=await axios.request(options)
            if(response.status >= 200 && response.status < 300){
                setMsg("Redirecting...")
            setTimeout(()=>{
                navigate('/products');  
            },2000)
            }
            
        }catch(error){
            console.error("Error",error)
        }
    };

    return (
        <>
        <Navbar></Navbar>
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Set Your Preferences</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h3 className="text-lg mb-2">Select Products</h3>
                    {productOptions.map(product => (
                        <label key={product} className="block mb-2">
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(product)}
                                onChange={() => handleProductChange(product)}
                                className="mr-2"
                            />
                            {product}
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <h3 className="text-lg mb-2">Price Range</h3>
                    <div className="flex gap-4">
                        <div>
                            <label className="block">Minimum:</label>
                            <input
                                type="number"
                                name="minimum"
                                min="0"
                                value={priceRange.minimum}
                                onChange={handlePriceChange}
                                className="border p-1 text-black"
                            />
                        </div>
                        <div>
                            <label className="block">Maximum:</label>
                            <input
                                type="number"
                                name="maximum"
                                min={priceRange.minimum + 1}
                                value={priceRange.maximum}
                                onChange={handlePriceChange}
                                className="border p-1 text-black"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {msg}
                </button>
            </form>
        </div>
        </>
        
    );
}

export default Setpreference;