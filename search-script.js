

class PhotoGallery{
    constructor(){
      this.API_KEY = '563492ad6f91700001000001169f575e77e147ed8561368fb50b5407';
      this.galleryDIv = document.querySelector('.gallery');
      this.searchForm = document.querySelector('.header form');
      this.loadMore = document.querySelector('.load-more');
      this.pageIndex = 1;
      this.searchValueGlobal = '';
      this.eventHandle();
    }
    eventHandle(){
      document.addEventListener('DOMContentLoaded',()=>{
        this.getImg(1);
      });
      this.searchForm.addEventListener('submit', (e)=>{
        this.pageIndex = 1;
        this.getSearchedImages(e);
      });
      this.loadMore.addEventListener('click', (e)=>{
        this.loadMoreImages(e);
      })
      
    }
    async getImg(index){
      this.loadMore.setAttribute('data-img', 'curated');
      const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=12`;
      const data = await this.fetchImages(baseURL);
      this.GenerateHTML(data.photos)
      console.log(data)
    }
    async fetchImages(baseURL){
      const response = await fetch(baseURL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: this.API_KEY
        }
      });
      const data = await response.json();
      return data;
    }
    GenerateHTML(photos){
      photos.forEach(photo=>{
        const item= document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
        <div class="box" value="${photo.src.large}" >
            <a href='${photo.src.original}' target="_blank">
            <img src="${photo.src.medium}">
            </a> 
            <div class="tooltip">
<span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
</div>
        </div>
        `;
        
        this.galleryDIv.appendChild(item)
      })
    }
    async getSearchedImages(e){
      this.loadMore.setAttribute('data-img', 'search');
      e.preventDefault();
      this.galleryDIv.innerHTML='';
      const searchValue = e.target.querySelector('input').value;
      this.searchValueGlobal = searchValue;
      const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=12`
      const data = await this.fetchImages(baseURL);
      this.GenerateHTML(data.photos);
      e.target.reset();
    }
    async getMoreSearchedImages(index){
      const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=12`
      const data = await this.fetchImages(baseURL);
      console.log(data)
      this.GenerateHTML(data.photos);
    }
    loadMoreImages(e){
      let index = ++this.pageIndex;
      const loadMoreData = e.target.getAttribute('data-img');
      if(loadMoreData === 'curated'){
        // load next page for curated
        this.getImg(index)
      }else{
        // load next page for search
        this.getMoreSearchedImages(index);
      }
    }
  }
  
const gallery = new PhotoGallery;

document.querySelectorAll(".gallery").forEach(item => {
	item.addEventListener("click", async (event) => {
		if (!navigator.clipboard) {
			// Clipboard API not available
			return;
		}
		try {
      let url = event.target.getAttribute('value');
			await navigator.clipboard.writeText(url);
			alert("Copied to clipboard");
			
			var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied"
			
		} catch (err) {
			console.error("Failed to copy!", err);
		}
	});
});