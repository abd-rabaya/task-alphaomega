import axios from 'axios';

export const fetchTableData = async (page, search) => {
    const response = await axios.get(`https://swapi.dev/api/people/.json?page=${page}&&search=${search}`);
    return response.data;
  };