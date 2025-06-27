import axios from 'axios';

export const sendContactMessage = async (data) => {
  return axios.post('https://eduminds-production-180d.up.railway.app/api/contact', data);
};
