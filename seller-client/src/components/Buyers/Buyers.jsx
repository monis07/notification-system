import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from 'axios'


function Buyers(){

    const [buyers, setBuyers] = useState([])

const API_URL = 'https://notification-system-phfp.onrender.com'
const {id} = useParams();

    useEffect(()=>{
        fetchBuyers()
        },[])

    const fetchBuyers = async() =>{
        try{
            const options = {
                method : 'GET',
                url : API_URL + '/seller/getBuyers/' + id,
                headers : {
                    'Content-Type' : 'application/json',
                    authorization : localStorage.getItem('seller-token')
                }
            }
            const response = await axios.request(options)
            console.log("Emails ->",response.data.buyerEmails)
            setBuyers(response.data.buyerEmails)

        }catch(error){
            console.error(error)
        }
        
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8">
            {buyers.length === 0 ? (
                <div className="text-gray-400 text-center text-xl">
                    No buyers found
                </div>
            ) : (
                <div className="max-w-2xl mx-auto space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Your Buyers</h2>
                    {buyers.map((buyer) => (
                        <div 
                            key={buyer}
                            className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
                        >
                            <div className="text-gray-200 flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {buyer}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}

export default Buyers