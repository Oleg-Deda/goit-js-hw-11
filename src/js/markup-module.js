export function galleryMarkup(arr) {
  return arr
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
}
