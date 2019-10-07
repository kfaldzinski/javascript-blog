'use strict';

function titleClickHandler(event){
    event.preventDefault();
    const clickedElement = this;
    console.log('Link was clicked!');

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activLink of activeLinks){
    activLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post');

    for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector); 
    console.log(targetArticle);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

//Generate title links

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';

function generateTitleLinks(){
    console.log(generateTitleLinks);

    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* [DONE] for each article */
    const articles = document.querySelectorAll(optArticleSelector);

    let html = '';

    for(let article of articles){

        /* [DONE] get the article id */
        const articleId = article.getAttribute('id');

        /* [DONE] find the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* [DONE] get the title from the title element */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        console.log(linkHTML);

        /* [DONE] create HTML of the link */
        titleList.innerHTML = titleList.innerHTML + linkHTML;

        /* [DONE] insert link into titleList */
        html = html + linkHTML;
    }

    titleList.innerHTML = html;
}

generateTitleLinks();

const links = document.querySelectorAll('.titles a');

for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }