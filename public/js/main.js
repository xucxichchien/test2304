$(function() {
    if($('text#t').length) {
        CKEDITOR.replace('t');
    }

    $('a.confirmDeletion').on('click', function(e){
        if (!confirm('Confirm Deletion')) 
        return false;
    });
});