import axios from "axios";


const PhotoSearchAPI = axios.create({
  baseURL: 'https://pixabay.com/api/',
});
const KEY = '32800459-f497cc305ed72b583c0cab75b';


export async function fetchPhotos(searchQuery, page) {
    const response = await PhotoSearchAPI.get(`?key=${KEY}&q=${searchQuery}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${page}`);
    return response;
}
