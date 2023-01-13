import './css/styles.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPhotos } from './fetch-photos.js';

const input = document.querySelector('input[name = "searchQuery"]');
const submitBtn = document.querySelector('.submit-btn');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 1;
let searchQuery = "";

if (gallery.innerHTML === "") {
    loadMoreBtn.disabled = true;
    loadMoreBtn.classList.add("visually-hidden");
}

submitBtn.addEventListener('click', onSubmitClick);
loadMoreBtn.addEventListener('click', onLoadMore)

function onSubmitClick(e) {
    e.preventDefault();
    onSearch(e);
}

async function onLoadMore(searchQuery) {
    searchQuery = input.value.trim();
    page += 1;
    try {
        const result = await fetchPhotos(searchQuery, page);
        let photos = addPhotos(result.data.hits);
        gallery.insertAdjacentHTML("beforeend", photos);

        let photosRemnant = result.data.totalHits - 40 * page;
        if (photosRemnant < 1) {
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
            disableLoadMoreBtn();
        }
    }
    catch (error) {
        console.log(error.message)
    }
    const simplelightbox = new SimpleLightbox('.photo-card a', {
        captiondDelay: 250,
        captionsData: 'alt'
    })
    console.log(`Page: ${page}`)
    simplelightbox.refresh();

    const { height: cardHeight } = gallery
        .firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

async function onSearch(e) {
    e.preventDefault();
    searchQuery = input.value.trim();
    if (searchQuery !== "") {
        try {
            page = 1;
            const result = await fetchPhotos(searchQuery, page)
            const photos = addPhotos(result.data.hits)
            gallery.innerHTML = photos;

            disableLoadMoreBtn();
            const simplelightbox = new SimpleLightbox('.photo-card a', {
                captiondDelay: 250,
                captionsData: 'alt'
            })
            console.log(`Page: ${page}`)

            if (result.data.hits.length === 0) {
                disableLoadMoreBtn();
                Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            } else Notiflix.Notify.success(`Hooray! We found ${result.data.totalHits} images.`)
            if (result.data.hits.length < 40) {
                loadMoreBtn.disabled = true;
                loadMoreBtn.classList.add("visually-hidden")
            } else {
                loadMoreBtn.disabled = false;
                loadMoreBtn.classList.remove("visually-hidden")
            }
        } catch (error) {
            console.log(error.message)
        }
    }
}


function addPhotos(photos) {
    return photos.map(photo => {
        return `<div class="photo-card">
    <a class="gallery__item" href ="${photo.largeImageURL}" >
    <img src="${photo.webformatURL}" class = "gallery__image" alt="${photo.tags}" loading="lazy" />
    </a>
    <div class="info">
        <p class="info-item">
            <b>Likes: ${photo.likes}</b>
        </p>
        <p class="info-item">
            <b>Views: ${photo.views}</b>
        </p>
        <p class="info-item">
            <b>Comments: ${photo.comments}</b>
        </p>
        <p class="info-item">
            <b>Downloads: ${photo.downloads}</b>
        </p>
    </div>
</div>`;
    }).join('');
}

function disableLoadMoreBtn() {
    loadMoreBtn.disabled = true;
    loadMoreBtn.classList.add("visually-hidden")
}
