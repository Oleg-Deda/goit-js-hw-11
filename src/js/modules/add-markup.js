import { refs } from './refs';
import { galleryMarkup } from './markup-module';
export default function addMarkup(arr) {
  refs.galleryRef.insertAdjacentHTML('beforeend', galleryMarkup(arr));
}
