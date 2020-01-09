import DataURLtoFile from './image_conversion.js';

function FetchContentImage(id) {

    var getAllImages = document.getElementsByClassName(id)[0].getElementsByTagName('img');

    var results = [];

    // loop through it
    for (var i = 0; i < getAllImages.length; i++) {

        var image_file =  DataURLtoFile(getAllImages[i].src, 'context_text_image-'+i);

        results.push(image_file);

        getAllImages[i].src = "image"+i+"";

    }

    return results;
}

export default FetchContentImage;