const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
let bookmarks = {}
// Show modal and focus on first input
function showModal(){
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

function closeModal(){
  modal.classList.remove('show-modal');
}
modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', closeModal)
window.addEventListener('click', (e)=> (e.target ===modal ? closeModal() : false))

// validate form

function validate(name,url){
  const expression = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
  const regex = new RegExp(expression)
  if(!name||!url){
    alert('Please fill out the form fully')
    return false
  }
  if(!url.match(regex)){
    alert('Please provide valid url')
    return false
  }
  return true
}
// build bookmarks
function buildBookmarks(){
  bookmarksContainer.innerHTML =''
  // build items
  Object.keys(bookmarks).forEach((id)=>{
    const {name,url} = bookmarks[id]
    // Item
    const item = document.createElement('div');
    item.classList.add('item')
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas','fa-times')
    closeIcon.setAttribute('title','Delete bookmark')
    closeIcon.setAttribute('onClick',`deleteBookmark('${url}')`)
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    const favicon = document.createElement('img');
    favicon.src = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    const link = document.createElement('a');
    link.setAttribute('href',url)
    link.setAttribute('target','_blank')
    link.textContent= name
    // Append all the things together

    linkInfo.append(favicon,link)
    item.append(closeIcon,linkInfo)
    bookmarksContainer.appendChild(item)
  })
}

function deleteBookmark(id){
  if(bookmarks[id]){
    delete bookmarks[id]
  }
  // Update bookmarks array in local storage
  localStorage.setItem('bookmarks',JSON.stringify(bookmarks))
  fetchBookmarks()
}


function fetchBookmarks(){
  if(localStorage.getItem('bookmarks')){
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
  }else{
    const id = 'https://netflix.com'
    bookmarks[id] = {
      name:'Netflix',
      url:'https://netflix.com'
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }
  buildBookmarks();
}


function storeBookmark(e){
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if(!urlValue.includes('http','https')){
    urlValue = `https://${urlValue}`
  }
  if(!validate(nameValue, urlValue)){
    return false
  }
  const bookmark = {
    name:nameValue,
    url:urlValue
  }
  bookmarks[urlValue] = bookmark
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  fetchBookmarks()
  bookmarkForm.reset()
  websiteNameEl.focus()
}


bookmarkForm.addEventListener('submit', storeBookmark);

// on load 
fetchBookmarks();