import axios from "axios";


// const baseURL = axios.create({
//   baseURL: 'https://pixabay.com/api/',
// });
// const KEY = '32800459-f497cc305ed72b583c0cab75b';


export async function fetchPhotos(searchQuery, page) {
    const response = await axios.get(`https://pixabay.com/api/?key=32800459-f497cc305ed72b583c0cab75b&q=${searchQuery}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${page}`);
    return response;
}
