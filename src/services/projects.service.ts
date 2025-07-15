import axios from 'axios';
import environment from '../environment/environment';

async function getAllProject(){
    let url=environment.backendUrl
    const result=await axios.get(`${url}/getAllProject`);
    return result
}

export default {
    getAllProject:getAllProject()
}
