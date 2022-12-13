import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  guardRef: document.querySelector('.js-guard'),
};
const imgSearchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/?key=';
const PRIVATE_KEY = '31807807-17cb391c400c3017e2cd782ac';

imgSearchFormEl.addEventListener('submit', onSearchHandler);
let query = '';
// let totalPages = 0;
let pageCounter = 1;
const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(loadMoreOnScroll, options);

async function fetchPhotoApi(searchQuery, pageNumber) {
  try {
    const resp = await axios.get(BASE_URL, {
      params: {
        key: `${PRIVATE_KEY}`,
        q: `${searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        page: `${pageNumber}`,
        safesearch: true,
        per_page: '40',
      },
    });
    return resp;
  } catch (error) {
    console.log(error);
  }
}


async function onSearchHandler(event) {
  event.preventDefault();
  pageCounter = 1;
  observer.unobserve(loadMoreEl);
  query = imgSearchFormEl.elements.searchQuery.value.trim();
  galleryEl.innerHTML = '';
   if (!query) {

    return;
  }
  const {
    data: { totalHits, hits, total },
    config: {
      params: { per_page },
    },
  } = await fetchPhotoApi(query, pageCounter);
  if (hits.length == per_page) {
    observer.observe(loadMoreEl);
  }
  if (!total) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    try {
      addMarkup(hits);
      gallerySimpleLightbox.refresh();

      const { height: formHeight } = imgSearchFormEl.getBoundingClientRect();

      window.scrollBy({
        top: formHeight,
        behavior: 'smooth',
      });
    } catch (error) {
      //  console.log(error);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return query;
  }
}


async function onLoadMoreClickHandler() {
  pageCounter += 1;
  const {
    data: { hits },
    config: {
      params: { per_page },
    },
  } = await fetchImages(query, pageCounter);

  if (hits.length != per_page) {
    loadMoreBtnEl.classList.add('is-hidden');
  }
  if (!hits.length) {
    throw new Error();
  } else {
    try {
      addMarkup(hits);
      gallerySimpleLightbox.refresh();
      const { height: cardHeight } =
        galleryEl.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
      });
    } catch (error) {
      console.log(error);
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
}

async function loadMoreOnScroll(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      pageCounter += 1;
      const resp = await fetchPhotoApi(query, pageCounter);
      const {
        data: { hits,totalHits },
        config: {
          params: { per_page },
        },
      } = resp;
      try {

        if (hits.length != per_page) {
          Notify.info(
            'These are the last search results, so feel free to search something else.'
          );
        }

        if (pageCounter === Math.round(totalHits / per_page)) {
        observer.unobserve(refs.guardRef);
        observerBottom.observe(refs.guardRef);
        pageCounter = 1;
          Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );


          throw new Error();
        } else {
          addMarkup(hits);
          gallerySimpleLightbox.refresh();
          const { height: cardHeight } =
            galleryEl.firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 3,
            behavior: 'smooth',
          });
        }
      } catch (error) {
        console.log(error);
        // Notify.warning(
        //   "We're sorry, but you've reached the end of search results."
      // };

        // );
      }
    }
  });
}

 function addMarkup(hits) {
   const markup = hits
     .map(
       ({
         largeImageURL,
         webformatURL,
         tags,
         likes,
         views,
         comments,
         downloads,
       }) => {
         return `<a href="${largeImageURL}">
                  <div class="photo-card">
                  <div class="photo-thumb">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                    </div>
                    <div class="info">
                      <p class="info-item">
                          <b>Likes</b>
                          ${likes}
                      </p>
                      <p class="info-item">
                          <b>Views</b>
                          ${views}
                      </p>
                      <p class="info-item">
                          <b>Comments</b>
                          ${comments}
                      </p>
                      <p class="info-item">
                          <b>Downloads</b>
                          ${downloads}
                      </p>
                    </div>
                  </div></a>`;
       }
     )
     .join('');
   galleryEl.insertAdjacentHTML('beforeend', markup);
}

let gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const optionsBottom = {
  root: null,
  rootMargin: '1px',
  threshold: 1.0,
};
// Observer message
export const observerBottom = new IntersectionObserver(
  OnBottomMessage,
  optionsBottom
);

function OnBottomMessage(entries, observerBottom) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
