const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


const seachField = document.getElementById('search').addEventListener('keypress',function(event){
  if(event.key == 'Enter'){
    searchBtn.click();
  }
})

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = images => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  
    images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
    toggleSpinner(false);
  });

}

//error
const displayError = error => {
  const errorTag = document.getElementById('error');
  errorTag.innerText = error;
  console.log(errorTag)
}

//Loading
const toggleSpinner = (show) => {
  const spinner = document.getElementById('loading');
  // console.log(spinner.classList);
  if(show){
    spinner.style.display = 'block';
  }
  else{
    spinner.style.display = 'none';
  }
  
}
const getImages = (query) => {
  toggleSpinner(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    // .then(data => showImages(data.image))
    // .then(data => console.log((data)))
    // .catch(err => console.log(err))
    .catch(error => displayError ('Something Went Wrong! Please Try Again Later'));
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // alert('Hey, Already added !')
   sliders.pop(img);    
   element.classList.remove('added'); 
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000; //change id name duration 
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  // timer = setInterval(function () {
  //   slideIndex++;
  //   changeSlide(slideIndex);
  // }, duration);

  if(duration<1000){
    const errorTag = document.getElementById('error');
    errorTag.innerText = "Enter at least 1000 ms";
    const sliderContainer = document.getElementById('sliders');
    sliderContainer.style.display = 'none';
    return false;
  }
  else{
     
      timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
    const sliderContainer = document.getElementById('sliders');
     sliderContainer.style.display = 'block';
  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  if(search.value == ''){
    // alert("ddd");
    const errorTag = document.getElementById('error');
    errorTag.innerText = "Input Field Can't Be Empty";
    return false;
  }
  else{
    sliders.length = 0;
  }
  getImages(search.value)
  
  
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})


