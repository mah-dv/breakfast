// Initializing the literallycanvas object
var lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {
        imageURLPrefix: '/lib/literallycanvas/img'
    }
);

// Initializing the tinymce object
tinymce.init({
    selector:'textarea',
    menu: {}
});
