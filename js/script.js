'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');

  //remove class 'active' from all article links
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  //add class 'active' to the clicked link
  clickedElement.classList.add('active');
  //console.log('Clicked element:', clickedElement);


  //remove class 'active' from all articles
  const activeArticles = document.querySelectorAll('.post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  //get 'href' attribute from the clicked link
  const articleSelector = clickedElement.getAttribute('href');
  //console.log('Href attribute from the clicked link:', articleSelector);

  //find the correct article using the selector (value of 'href' attribute)
  const targetArticle = document.querySelector(articleSelector); 
  //console.log('Correct article:', targetArticle);

  //add class 'active' to the correct article
  targetArticle.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.list.tags',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors-';

function generateTitleLinks(customSelector = ''){

  //remove contents of titleList
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  //for each article
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  // console.log(articles);

  let html = '';

  for(let article of articles){

    //get the article id
    const articleId = article.getAttribute('id');

    //find the title element
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    //get the title from the title element
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    // console.log(linkHTML);

    //create html of the link
    titleList.innerHTML = titleList.innerHTML + linkHTML;

    //insert link into titleList
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = {
    max: 0,
    min: 999999
  }
 
  for(const tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if (tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params){
  //console.log('test');
  console.log(count);
  console.log(params);
  //console.log(optCloudClassCount);

  //looking for a count, which is a subtract beetween a value out tag(6) vs. params.min
  const normalizedCount = count - params.min;

  //do const as subtract beetween params.max & params.min
  const normalizedMax = params.max - params.min;

  //do percentage beetwen normalizedCount & normalizedMax
  const percentage = normalizedCount / normalizedMax;

  //do const classNumber as algorithm integer lottery draw
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  console.log('test');
  console.log('normalizedCount =', normalizedCount);
  console.log('normalizedMax =', normalizedMax);
  console.log('percentage = ', percentage);
  console.log('classNumber =', classNumber);

  return "tag-size-" + classNumber;
}

function generateTags(){
  //[NEW] create a new variable allTags with an empty object
  let allTags = {};

  //find all articles
  const articles = document.querySelectorAll(optArticleSelector);

  //Start LOOP for every article
  for(let article of articles){

    //find tags wrapper
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    //make html variable with empty string
    let html = '';

    //get tags from 'data-tags' attribute
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);

    //split tags into array
    const articleTagsArray = articleTags.split(' ');

    //start LOOP for each tag
    for(let tag of articleTagsArray){

      //generate html of the link
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      //console.log(linkHTML);

      //add generated code to html variable
      html = html + linkHTML;

      //[NEW] check if this link is not already in allTags
      if(!allTags.hasOwnProperty(tag)){
        //[NEW] add tag to allTags object
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

      //end LOOP for each tag
    }

    //insert html of all the links into the tags wrapper
    tagsWrapper.innerHTML = html;

  //end LOOP for every article
  }

  //[NEW] find list of tags in right column
  const tagList = document.querySelector('.tags');

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  //[NEW] create variable for all links html code
  let allTagsHTML = '';
  
  //[NEW] start LOOP for each tag in allTags
  for(let tag in allTags){
    const tagLink = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
  //[NEW] generate code of a link and add it to allTagsHTML
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-' + tag + '">'+ tag + '(' + allTags[tag] + ')' +'</a></li>';
    console.log('tagLinkHTML:', tagLinkHTML);
    allTagsHTML += tagLinkHTML;

  //[NEW] end LOOP for each tag in allTags
  }

  //[NEW] add html from allTagsHTML to tagList
  tagList.innerHTML = allTagsHTML;  

}

generateTags();

function tagClickHandler(event){

  //prevent default action for this event
  event.preventDefault();

  //make new constant named 'clickedElement' and give it the value of 'this'
  const clickedElement = this;

  //make a new constant 'href' and read the attribute 'href' of the clicked element
  const href = clickedElement.getAttribute('href');
  //console.log('href');

  //make a new constant 'tag' and extract tag from the 'href' constant
  const tag = href.replace('#tag-', '');

  //find all tag links with class active
  const activeTag = document.querySelectorAll('a.active[href^="#tag-"]');

  //start LOOP for each active tag link
  for(let tag of activeTag){

    //remove class active
    tag.classList.remove('active');
    //console.log(tag.classList);

  //end LOOP for each active tag link
  }  

  //find all tag links with 'href' attribute equal to the 'href' constant
  const tagLinks = document.querySelectorAll('href');
  //console.log(tagLinks);

  //start LOOP for each found tag link
  for(let tag of tagLinks){

    //add class active
    tag.classList.add('active');
    //console.log(tag.classList);

  //end LOOP for each found tag link
  }

  //execute function 'generateTitleLinks' with article selector as argument
  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags(){

  //find all links to tags
  const tags = document.querySelectorAll('a[href^="#tag-"]');

  //console.log(tags);

  //start LOOP for each link
  for(let tag of tags){

    //add tagClickHandler as event listener for that link
    tag.addEventListener('click', tagClickHandler);
  }

  //end LOOP for each link
}

addClickListenersToTags();

function generateAuthors(){

  //find all articles
  const articles = document.querySelectorAll(optArticleSelector);
  //console.log(articles);

  //start LOOP for every authors
  for(let article of articles){

    //find author wrapper
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    //console.log(authorWrapper);

    //get author from 'data-author' attribute
    const articleAuthor = article.getAttribute('data-author');
    //console.log(articleAuthors);

    //insert html of all the links into the tags wrapper
    authorWrapper.innerHTML = 'By <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';

  //end LOOP for every authors
  }

}

generateAuthors();

function authorClickHandler(event) {

  //prevent action for this event
  event.preventDefault();
  
  //make new const named clickedElement and give it value this
  const clickedElement = this;
  
  //make a new const 'href' and read the attribute href of the clicked element
  const href = clickedElement.getAttribute('href');
  
  //make a new const 'author' and extract author from the 'href' constant
  const author = href.replace('#author-', '');
  
  //find all author links with class active
  const activeAuthorLinks = document.querySelectorAll('a[href="#author-"]');
  
  //start LOOP for each active author link
  for(let activeAuthorLink of activeAuthorLinks){
    
    //remove class active
    activeAuthorLink.classList.remove('active');
  
  //end LOOP for each active author link
  }
  
  // find all author links with 'href' attribute equal to the 'href' constant
  const authorLists = document.querySelectorAll(href);
  
  //start LOOP for each found author link
  for(let authorLink of authorLists){

    //add active class
    authorLink.classList.add('active');
  
  //end LOOP for each found author link
  }
  
  //execute function 'generateTitleLinks' with author selector as argument
  generateTitleLinks('[data-author="' + author + '"]');

}


function addClickListenersToAuthors(){

  //find all links to authors
  const authors = document.querySelectorAll('a[href^="#author-"]');
  //console.log(tags);

  //start LOOP for each link
  for(let author of authors){

    //add tagClickHandler as event listener for that link
    author.addEventListener('click', authorClickHandler);
      
  //end LOOP for each link
  }

}

addClickListenersToAuthors();