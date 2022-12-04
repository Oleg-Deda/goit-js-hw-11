import { fetchPhotoApi } from './fetch-data';
import { refs } from './refs';
import { PER_PAGE } from './fetch-data';
import { notifyInfoMessage } from './notify-msg';
import { simpleGallery } from './simple-lightbox';
import {
  notifySuccessMessage,
  notifyFailureMessage,
 } from './notify-msg';
import addMarkup from './add-markup';

let searchQuery = '';
export let pageNumber = 1;
export let totalHits = '';

refs.searchFormRef.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  pageNumber = 1;
  observer.unobserve(refs.guardRef);
  searchQuery = event.currentTarget.searchQuery.value.trim();
  refs.galleryRef.innerHTML = '';
  event.currentTarget.reset();

  if (!searchQuery) {
    refs.galleryRef.innerHTML = '';
    notifyInfoSearchMessage();
    return;
  }

  await fetchPhotoApi(searchQuery, pageNumber)
    .then(gallery => {
      totalHits = gallery.data.totalHits;

      if (!totalHits) {
        return notifyFailureMessage();
      }
      notifySuccessMessage(totalHits);
      addMarkup(gallery.data.hits);

      simpleGallery.refresh();

      observer.observe(refs.guardRef);
    })
    .catch(error => console.log(error));
}

export { onSearch, searchQuery };


// Observer Options
const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};


export const observer = new IntersectionObserver(onLoad, options);

// infinite scroll
async function onLoad(entries, observer) {
  await entries.forEach(entry => {
    if (entry.isIntersecting) {
      pageNumber += 1;

      fetchPhotoApi(searchQuery, pageNumber)
        .then(gallery => {
          addMarkup(gallery.data.hits);
          simpleGallery.refresh();
          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        })
        .catch(error => {
          console.log(error);
        });

      if (pageNumber === Math.round(totalHits / PER_PAGE)) {
        observer.unobserve(refs.guardRef);
        observerBottom.observe(refs.guardRef);
        pageNumber = 1;
      }
    }
  });
}

const optionsBottom = {
  root: null,
  rootMargin: '1px',
  threshold: 1.0,
};
export const observerBottom = new IntersectionObserver(
  OnBottomMessage,
  optionsBottom
);

function OnBottomMessage(entries, observerBottom) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      notifyInfoMessage();
    }
  });
}
