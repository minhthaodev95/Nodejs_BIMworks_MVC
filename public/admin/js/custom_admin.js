
let tags = [];
function getInputValue(){
    // Selecting the input element and get its value 
    var tag = document.getElementsByClassName('tag')[0].value;

    // Displaying the value
    tags.push(tag);
    let content = tags.map((tag) => '<span class="tags_item label label-primary">' + tag + '</span>')

    document.getElementById('displayTags').innerHTML= content.join('')
    document.getElementsByClassName('tagsValue')[0].value = tags
}


