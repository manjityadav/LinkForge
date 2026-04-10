import axios from "axios"

export const Base_url='https://linkforge-otrt.onrender.com'
export const clientServer=axios.create({
    baseURL:Base_url,
})