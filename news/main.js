const API_KEY = '' // your api key'

let newsList = []

const menus = document.querySelectorAll('.menus button')
menus.forEach((menu) => menu.addEventListener('click', async (event) => getNewsByCategory(event)))

let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
    try {
        url.searchParams.set('page', page) // => &page=page
        url.searchParams.set('pageSize', pageSize) // => &pageSize=pageSize

        console.log("url", url)
        const response = await fetch(url)
        const data = await response.json();
        console.log("data", data)

        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error('No result for this search')
            }
            newsList = data.articles;
            totalResults = data.totalResults;
            render();
            paginationRender();
        } else {
            throw new Error(data.message)
        }

    } catch (error) {
        errorRender(error.message);
    }
}

const getLatestNews = async () => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
    getNews();
}

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
    getNews();
}

const getNewsByKeyword = async () => {
    const keyword = document.getElementById('search-input').value;
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`);
    getNews();
}

// 1. 버튼들에 클릭 이벤트를 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 뉴스 리스트를 렌더링하기


const render = () => {
    const newsHTML = newsList.map((news) => `<div class="row news">
            <div class="col-lg-4">
          <img class="news-img-size"
            src="${news.urlToImage}"
          />
        </div>
        <div class="col-lg-8">
          <h4>${news.title}</h4>
          <p>${news.description}</p>
          
          <div>
            ${news.source.name} * ${news.publishedAt}
          </div>
        </div>
      </div>`).join('')

    document.getElementById('news-board').innerHTML = newsHTML
}

const errorRender = (errorMessage) => {
    const errorHTML = `<div class="alert alert-danger" role="alert">
                ${errorMessage}
                </div>`

    document.getElementById('news-board').innerHTML = errorHTML
}

// Pagination
// totalResults = 101 (주어지는 값)
// pageSize = 10 (지정)
// page = 3 (지정)

// groupSize = 5 (지정)
// totalPages = totalResults / pageSize 나머지는 올림 (계산)
// pageGroup = page / groupSize 나머지는 올림 (계산)
// 속한 페이지 그룹의 마지막 페이지 = groupSize * pageGroup
// 속한 페이지 그룹의 첫번째 페이지 = groupSize * (pageGroup - 1) + 1
// = 마지막 페이지 - (groupSize - 1)

const paginationRender = () => {
    const pageGroup = Math.ceil(page / groupSize);
    const totalPages = Math.ceil(totalResults / pageSize);

    let lastPage = pageGroup * groupSize > totalPages ? totalPages : pageGroup * groupSize;
    // 마지막 페이지 그룹이 그룹사이즈보다 작으면 => lastPage = totalPage
    // if (lastPage > totalPages) {
    //     lastPage = totalPages;
    // }

    const firstPage = lastPage - (groupSize - 1) < 1 ? 1 : lastPage - (groupSize - 1);
    // 첫번째 페이지 그룹이 1보다 작으면 => firstPage = 1
    // if (firstPage < 1) {
    //     firstPage = 1;
    // }
    console.log("page", page)
    let paginationHTML = ``;

    if (page > 1) {
        paginationHTML = `<li class="page-item ${page === 1 ? "disabled" : ""}" 
        onclick="moveToPage(1)">
            <a class="page-link" >&lt;&lt;</a>
        </li>
        <li class="page-item ${page === 1 ? "disabled" : ""}" 
        onclick="moveToPage(${page - 1})">
            <a class="page-link" >&lt;</a>
        </li>`
    }

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? "active" : ""}" 
        onclick="moveToPage(${i})"><a class="page-link"  >${i}</a></li>`
    }

    if (page < totalPages) {
        paginationHTML += `<li class="page-item ${page === 1 ? "disabled" : ""}" 
        onclick="moveToPage(${page + 1})">
            <a class="page-link" >&gt;</a>
        </li>
        <li class="page-item ${page === 1 ? "disabled" : ""}" 
        onclick="moveToPage(${totalPages})">
            <a class="page-link" >&gt;&gt;</a>
        </li>`
    }

    document.querySelector('.pagination').innerHTML = paginationHTML

    // <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    // <li class="page-item"><a class="page-link" href="#">1</a></li>
    // <li class="page-item"><a class="page-link" href="#">2</a></li>
    // <li class="page-item"><a class="page-link" href="#">3</a></li>
    // <li class="page-item"><a class="page-link" href="#">Next</a></li>

}

const moveToPage = (pageNum) => {
    console.log("moveToPage", pageNum)
    page = pageNum;

    getNews();
}

getLatestNews();

