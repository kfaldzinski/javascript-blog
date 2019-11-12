const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

'use strict';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;

  //remove class 'active' from all article links
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  //add class 'active' to the clicked link
  clickedElement.classList.add('active');

  //remove class 'active' from all articles
  const activeArticles = document.querySelectorAll('.post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  //get 'href' attribute from the clicked link
  const articleSelector = clickedElement.getAttribute('href');

  //find the correct article using the selector (value of 'href' attribute)
  const targetArticle = document.querySelector(articleSelector); 

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

  let html = '';

  for(let article of articles){

    //get the article id
    const articleId = article.getAttribute('id');

    //find the title element
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    //get the title from the title element
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

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

function calculateTagsParams (tags){
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

  //looking for a count, which is a subtract beetween a value out tag(6) vs. params.min
  const normalizedCount = count - params.min;

  //do const as subtract beetween params.max & params.min
  const normalizedMax = params.max - params.min;

  //do percentage beetwen normalizedCount & normalizedMax
  const percentage = normalizedCount / normalizedMax;

  //do const classNumber as algorithm integer lottery draw
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

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

    //split tags into array
    const articleTagsArray = articleTags.split(' ');

    //start LOOP for each tag
    for(let tag of articleTagsArray){

      //generate html of the link
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.articleTagLink(linkHTMLData);

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

  //[NEW] create variable for all links html code
  let allTagsHTML = '';

  const allTagsData = { tags: [] };
  
  //[NEW] start LOOP for each tag in allTags
  for(let tag in allTags){
    //[NEW] generate code of a link and add it to allTagsHTML
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

  //[NEW] end LOOP for each tag in allTags
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);

}

generateTags();

function tagClickHandler(event){

  //prevent default action for this event
  event.preventDefault();

  //make new constant named 'clickedElement' and give it the value of 'this'
  const clickedElement = this;

  //make a new constant 'href' and read the attribute 'href' of the clicked element
  const href = clickedElement.getAttribute('href');

  //make a new constant 'tag' and extract tag from the 'href' constant
  const tag = href.replace('#tag-', '');

  //find all tag links with class active
  const activeTag = document.querySelectorAll('a.active[href^="#tag-"]');

  //start LOOP for each active tag link
  for(let tag of activeTag){

    //remove class active
    tag.classList.remove('active');

  //end LOOP for each active tag link
  }  

  //find all tag links with 'href' attribute equal to the 'href' constant
  const tagLinks = document.querySelectorAll('href');

  //start LOOP for each found tag link
  for(let tag of tagLinks){

    //add class active
    tag.classList.add('active');

  //end LOOP for each found tag link
  }

  //execute function 'generateTitleLinks' with article selector as argument
  generateTitleLinks('[data-tags~="' + tag + '"]');

}

function addClickListenersToTags(){

  //find all links to tags
  const tags = document.querySelectorAll('a[href^="#tag-"]');

  //start LOOP for each link
  for(let tag of tags){

    //add tagClickHandler as event listener for that link
    tag.addEventListener('click', tagClickHandler);
  }

  //end LOOP for each link
}

addClickListenersToTags();

function generateAuthors(){
  //[NEW] create a new variable allAuthor with an empty object
  let allAuthors = {};

  //find all articles
  const articles = document.querySelectorAll(optArticleSelector);

  //start LOOP for every authors
  for(let article of articles){

    //find author wrapper
    const authorWrapper = article.querySelector(optArticleAuthorSelector);

    //get author from 'data-author' attribute
    const articleAuthor = article.getAttribute('data-author');

    //insert html of all the links into the tags wrapper
    authorWrapper.innerHTML = 'By <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    const linkHTMLData = {articleAuthor: articleAuthor};
    const linkHTML = templates.articleAuthorLink(linkHTMLData);

    const [name, lastname] = articleAuthor.split(" ");
    const authorKey = name + lastname;
    if (!Object.prototype.hasOwnProperty.call(allAuthors, authorKey)) {
      allAuthors[authorKey] = {
        count: 1,
        name: name,
        lastname: lastname
      };
    } else {
      allAuthors[authorKey] = {
        count: allAuthors[authorKey].count + 1,
        name: name,
        lastname: lastname
      };
    }

  //end LOOP for every authors
  }

  //[NEW] find list of authors in right column
  const authorList = document.querySelector('.authors-');

  //[NEW] create variable for all links html code
  let allAuthorsHTML = '';

  const allAuthorsData = { authors: [] };

  //[NEW] start LOOP for each author in allAuthors
  for(let author in allAuthors){
    console.log(author);
    allAuthorsData.authors.push({
      name: allAuthors[author].name,
      lastname: allAuthors[author].lastname,
      count: allAuthors[author].count
    });

  }

  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);

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